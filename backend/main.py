from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
from models import User, Sequence, SequenceCreate, Collection, CollectionCreate, CollectionRead, Item, UserCreate, DisplayNameUpdate
from jose import jwt, jwk
from jose.exceptions import JWKError, ExpiredSignatureError, JWTClaimsError, JWTError
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from decouple import config, AutoConfig
import os
from passlib.context import CryptContext
import requests
from fastapi.routing import APIRoute
import pytz

from database import get_db

# Determine environment (development or production)
config_mode = config("NODE_ENV", default="development")

# Load configuration based on the environment
config_path = ".env.production" if config_mode == "production" else ".env"

# Continue with your existing configuration
config = AutoConfig(search_path=config_path)

DATABASE_URL = config("DATABASE_URL")
AUTH0_DOMAIN = config("VITE_AUTH0_DOMAIN")
AUTH0_AUDIENCE = config("VITE_AUTH0_AUDIENCE")

SECRET_KEY = config("SECRET_KEY")
ALGORITHM = "HS256"

engine = create_engine(DATABASE_URL)

# Create database tables
SQLModel.metadata.create_all(engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

ALLOWED_ORIGINS = config("ALLOWED_ORIGINS").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Use the list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth0 token validation
async def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = authorization.split(" ")[1]
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == jwt.get_unverified_header(token)["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                    "alg": key.get("alg", "RS256")
                }
        if rsa_key:
            payload = jwt.decode(
                token,
                jwk.construct(rsa_key),
                algorithms=[rsa_key["alg"]],
                audience=AUTH0_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/",
            )
            username: str = payload.get("sub")
            email: str = payload.get("email")  # Fetch email if available
            if username is None:
                raise credentials_exception
        else:
            raise credentials_exception
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTClaimsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid claims")
    except JWTError:
        raise credentials_exception

    # Check if user exists, if not, create the user
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        # Create the user if not found
        new_user = User(username=username, email=email, hashed_password="")  # No password since Auth0 handles auth
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    return user

# User Endpoints
@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/users/{user_id}/sequences", response_model=List[Sequence])
async def get_sequences(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.sequences

@app.post("/users/", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = pwd_context.hash(user.password)  # Hash the password
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Sequence Endpoints
@app.post("/sequences", response_model=Sequence)
async def create_sequence(sequence: SequenceCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == sequence.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    db_sequence = Sequence(
        name=sequence.name,
        description=sequence.description,
        user_id=user.user_id
    )
    db.add(db_sequence)
    db.commit()
    db.refresh(db_sequence)
    return db_sequence

@app.put("/users/me/display_name", response_model=User)
async def update_display_name(
    display_name_update: DisplayNameUpdate,  # Use the Pydantic model
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.display_name = display_name_update.display_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/sequences/{sequence_id}", response_model=Sequence)
async def update_sequence(sequence_id: int, updated_sequence: SequenceCreate, db: Session = Depends(get_db)):
    db_sequence = db.get(Sequence, sequence_id)
    if not db_sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    for key, value in updated_sequence.dict().items():
        setattr(db_sequence, key, value)
    db.commit()
    db.refresh(db_sequence)
    return db_sequence

@app.delete("/sequences/{sequence_id}")
async def delete_sequence(sequence_id: int, db: Session = Depends(get_db)):
    db_sequence = db.get(Sequence, sequence_id)
    if not db_sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    db.delete(db_sequence)
    db.commit()
    return {"detail": "Sequence deleted successfully"}

# Collection Endpoints
@app.post("/collections", response_model=Collection)
async def create_collection(
    collection: CollectionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Convert the current UTC time to MST
    utc_time = datetime.utcnow()
    mst_time = utc_time.astimezone(pytz.timezone('America/Denver'))
    
    db_collection = Collection(
        name=collection.name,
        description=collection.description,
        status=collection.status or "private",  
        category=collection.category,
        user_id=current_user.user_id,
        created_at=mst_time  # Set the created_at time to MST
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.get("/users/me/collections", response_model=List[CollectionRead])
async def get_collections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.collections

@app.get("/collections/{collection_id}/items")
async def get_collection_items(collection_id: int, db: Session = Depends(get_db)):
    items = db.query(Item).filter(Item.collection_id == collection_id).all()
    if not items:
        return []  
    return items

@app.put("/collections/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: int, 
    updated_collection: CollectionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    for key, value in updated_collection.dict().items():
        setattr(db_collection, key, value)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.delete("/collections/{collection_id}")
async def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(db_collection)
    db.commit()
    return {"detail": "Collection deleted successfully"}

@app.get("/collections/public", response_model=List[CollectionRead])
async def get_public_collections(db: Session = Depends(get_db)):
    public_collections = db.query(Collection).filter(Collection.status == "public").all()
    
    for collection in public_collections:
        collection.items = db.query(Item).filter(Item.collection_id == collection.collection_id).all()
    
    return public_collections

@app.post("/collections/{collection_id}/items")
async def create_items(collection_id: int, items: List[str], db: Session = Depends(get_db)):
    try:
        add_items_to_collection(db, collection_id, items)
        return {"message": "Items added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Utility function
def add_items_to_collection(db: Session, collection_id: int, items: List[str]):
    for item_name in items:
        item = Item(name=item_name, collection_id=collection_id)
        db.add(item)
    db.commit()

@app.post("/collections/subscribe/{collection_id}", response_model=Collection)
async def subscribe_to_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch the public collection
    public_collection = db.query(Collection).filter(Collection.collection_id == collection_id, Collection.status == "public").first()
    
    if not public_collection:
        raise HTTPException(status_code=404, detail="Collection not found or not public")

    # Check if the user has already subscribed to this collection
    existing_subscription = db.query(Collection).filter(Collection.name == public_collection.name, Collection.user_id == current_user.user_id).first()
    if existing_subscription:
        raise HTTPException(status_code=400, detail="You have already subscribed to this collection.")

    # Duplicate the collection for the user
    new_collection = Collection(
        name=public_collection.name,
        description=public_collection.description,
        category=public_collection.category,
        user_id=current_user.user_id,
        status="private"
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)
    return new_collection
