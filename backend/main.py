from fastapi import FastAPI, Depends, HTTPException, status, Header, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
from models import User, Sequence, SequenceCreate, Collection, CollectionCreate, CollectionRead, Item, UserCreate, DisplayNameUpdate, NameList, NameListCreate, NameListRead
from jose import jwt, jwk
from jose.exceptions import JWKError, ExpiredSignatureError, JWTClaimsError, JWTError
from datetime import datetime, timedelta
from typing import List, Optional
import logging
import os
from passlib.context import CryptContext
import requests
import pytz
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import time

from database import get_db, get_engine

# Logging setup
class MountainTimeFormatter(logging.Formatter):
    def converter(self, timestamp):
        dt = datetime.fromtimestamp(timestamp)
        return TIMEZONE.localize(dt)

    def formatTime(self, record, datefmt=None):
        dt = self.converter(record.created)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.isoformat()

# Update the logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(MountainTimeFormatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

# Set up environment configuration directly
DATABASE_URL = os.environ.get("DATABASE_URL")
AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.environ.get("AUTH0_AUDIENCE")
SECRET_KEY = os.environ.get("SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://race-the-clock-frontend-production.up.railway.app")
LOCAL_FRONTEND_URL = os.environ.get("LOCAL_FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [FRONTEND_URL, LOCAL_FRONTEND_URL]
ALGORITHM = "HS256"

TESTING = os.environ.get("TESTING", "False") == "True"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Single middleware function to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Received request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logger.info(f"Sending response: Status {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {type(e).__name__}")
        raise

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Auth0 token validation
async def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    logger.info("Attempting to validate token")
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
        logger.warning("Token has expired")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTClaimsError:
        logger.warning("Invalid claims")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid claims")
    except JWTError:
        logger.warning("JWT Error")
        raise credentials_exception
    except Exception as e:
        logger.error(f"Unexpected error during token validation: {type(e).__name__}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

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
    logger.info(f"Fetched current user: {current_user.username}")
    return current_user

@app.get("/users/{user_id}/sequences", response_model=List[Sequence])
async def get_sequences(user_id: str, db: Session = Depends(get_db)):
    user = db.exec(select(User).where(User.username == user_id)).first()
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
        user_id=user.user_id  # Use the actual user_id here
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
    # Get the current time in Mountain Time
    mst_time = datetime.now(TIMEZONE)
    
    db_collection = Collection(
        name=collection.name,
        description=collection.description,
        status=collection.status or "private",  
        category=collection.category,
        user_id=current_user.user_id,
        created_at=mst_time  # Set the created_at time to Mountain Time
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.get("/users/me/collections", response_model=List[CollectionRead])
async def get_collections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logger.info(f"Fetching collections for user: {current_user.username}")
    collections = current_user.collections
    logger.info(f"Found {len(collections)} collections")
    return collections

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

@app.post("/namelists/", response_model=NameListRead)
async def create_namelist(
    namelist: NameListCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_namelist = NameList(
        name=namelist.name,
        names=namelist.names,
        user_id=current_user.user_id
    )
    db.add(db_namelist)
    db.commit()
    db.refresh(db_namelist)
    return db_namelist

@app.get("/namelists/", response_model=List[NameListRead])
async def get_namelists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(NameList).filter(NameList.user_id == current_user.user_id).all()

@app.put("/namelists/{namelist_id}", response_model=NameListRead)
async def update_namelist(
    namelist_id: int,
    updated_namelist: NameListCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_namelist = db.query(NameList).filter(NameList.namelist_id == namelist_id, NameList.user_id == current_user.user_id).first()
    if not db_namelist:
        raise HTTPException(status_code=404, detail="NameList not found")
    
    db_namelist.name = updated_namelist.name
    db_namelist.names = updated_namelist.names
    db.commit()
    db.refresh(db_namelist)
    return db_namelist

@app.delete("/namelists/{namelist_id}")
async def delete_namelist(
    namelist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_namelist = db.query(NameList).filter(NameList.namelist_id == namelist_id, NameList.user_id == current_user.user_id).first()
    if not db_namelist:
        raise HTTPException(status_code=404, detail="NameList not found")
    
    db.delete(db_namelist)
    db.commit()
    return {"detail": "NameList deleted successfully"}

@app.get("/collections/search", response_model=List[CollectionRead])
async def search_collections(
    query: str = Query(None, min_length=1),
    db: Session = Depends(get_db)
):
    search = f"%{query}%"
    collections = db.query(Collection).join(User).filter(
        (Collection.status == "public") &
        (
            (Collection.name.ilike(search)) |
            (User.username.ilike(search))
        )
    ).all()
    
    for collection in collections:
        collection.items = db.query(Item).filter(Item.collection_id == collection.collection_id).all()
    
    return collections

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def create_db_and_tables():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)

def wait_for_db(db_url, max_retries=5, retry_interval=5):
    retries = 0
    while retries < max_retries:
        try:
            engine = create_engine(db_url)
            engine.connect()
            logger.info("Successfully connected to the database")
            return
        except OperationalError:
            retries += 1
            logger.warning(f"Database connection attempt {retries} failed. Retrying in {retry_interval} seconds...")
            time.sleep(retry_interval)
    
    raise Exception("Could not connect to the database after multiple attempts")

if __name__ == "__main__":
    wait_for_db(DATABASE_URL)
    create_db_and_tables()
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
