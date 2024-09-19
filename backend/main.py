import logging
from fastapi import FastAPI, Depends, HTTPException, status, Header, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
from models import User, Sequence, SequenceCreate, Collection, CollectionCreate, CollectionRead, Item, UserCreate, DisplayNameUpdate, NameList, NameListCreate, NameListRead
from jose import jwt, jwk
from jose.exceptions import JWKError, ExpiredSignatureError, JWTClaimsError, JWTError
from datetime import datetime, timedelta
from typing import List, Optional
import os
from passlib.context import CryptContext
import requests
import pytz
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import time

from database import get_db, get_engine

# Logging setup
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

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

logger.info("Starting application")
logger.debug(f"DATABASE_URL: {DATABASE_URL}")
logger.debug(f"AUTH0_DOMAIN: {AUTH0_DOMAIN}")
logger.debug(f"AUTH0_AUDIENCE: {AUTH0_AUDIENCE}")
logger.debug(f"FRONTEND_URL: {FRONTEND_URL}")
logger.debug(f"LOCAL_FRONTEND_URL: {LOCAL_FRONTEND_URL}")
logger.debug(f"ALLOWED_ORIGINS: {ALLOWED_ORIGINS}")
logger.debug(f"TESTING: {TESTING}")

# Single middleware function to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Received request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Sending response: Status {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        raise

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        logger.info(f"Token extracted: {token[:10]}...")  # Log first 10 chars of token
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        
        logger.info(f"Fetching JWKS from URL: {jwks_url}")
        
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
            logger.debug("RSA key found")
            payload = jwt.decode(
                token,
                jwk.construct(rsa_key),
                algorithms=[rsa_key["alg"]],
                audience=AUTH0_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/",
            )
            logger.debug(f"Token payload: {payload}")
            username: str = payload.get("sub")
            email: str = payload.get("email")
            if username is None:
                logger.warning("Username not found in token payload")
                raise credentials_exception
        else:
            logger.warning("RSA key not found")
            raise credentials_exception
    except ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTClaimsError as e:
        logger.warning(f"Invalid claims: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid claims: {str(e)}")
    except JWTError as e:
        logger.warning(f"JWT Error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        logger.error(f"Unexpected error during token validation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

    logger.info(f"Checking for user: {username}")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        logger.info(f"User not found, creating new user: {username}")
        new_user = User(username=username, email=email, hashed_password="")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user
    logger.info(f"User authenticated: {user.username}")
    return user

# User Endpoints
@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    logger.info(f"Current user: {current_user}")
    return current_user

@app.get("/users/{user_id}/sequences", response_model=List[Sequence])
async def get_sequences(user_id: str, db: Session = Depends(get_db)):
    logger.info(f"Fetching sequences for user: {user_id}")
    user = db.exec(select(User).where(User.username == user_id)).first()
    if not user:
        logger.warning(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Found {len(user.sequences)} sequences for user {user_id}")
    return user.sequences

@app.post("/users/", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating user: {user.username}")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        logger.warning(f"Username already registered: {user.username}")
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = pwd_context.hash(user.password)  # Hash the password
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User created: {new_user.username}")
    return new_user

# Sequence Endpoints
@app.post("/sequences", response_model=Sequence)
async def create_sequence(sequence: SequenceCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating sequence for user: {sequence.user_id}")
    user = db.query(User).filter(User.username == sequence.user_id).first()
    if not user:
        logger.warning(f"User not found: {sequence.user_id}")
        raise HTTPException(status_code=400, detail="User not found")
    db_sequence = Sequence(
        name=sequence.name,
        description=sequence.description,
        user_id=user.user_id  # Use the actual user_id here
    )
    db.add(db_sequence)
    db.commit()
    db.refresh(db_sequence)
    logger.info(f"Sequence created: {db_sequence.name}")
    return db_sequence

@app.put("/users/me/display_name", response_model=User)
async def update_display_name(
    display_name_update: DisplayNameUpdate,  # Use the Pydantic model
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating display name for user: {current_user.username}")
    current_user.display_name = display_name_update.display_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    logger.info(f"Display name updated: {current_user.display_name}")
    return current_user

@app.put("/sequences/{sequence_id}", response_model=Sequence)
async def update_sequence(sequence_id: int, updated_sequence: SequenceCreate, db: Session = Depends(get_db)):
    logger.info(f"Updating sequence: {sequence_id}")
    db_sequence = db.get(Sequence, sequence_id)
    if not db_sequence:
        logger.warning(f"Sequence not found: {sequence_id}")
        raise HTTPException(status_code=404, detail="Sequence not found")
    for key, value in updated_sequence.dict().items():
        setattr(db_sequence, key, value)
    db.commit()
    db.refresh(db_sequence)
    logger.info(f"Sequence updated: {db_sequence.name}")
    return db_sequence

@app.delete("/sequences/{sequence_id}")
async def delete_sequence(sequence_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting sequence: {sequence_id}")
    db_sequence = db.get(Sequence, sequence_id)
    if not db_sequence:
        logger.warning(f"Sequence not found: {sequence_id}")
        raise HTTPException(status_code=404, detail="Sequence not found")
    db.delete(db_sequence)
    db.commit()
    logger.info(f"Sequence deleted: {sequence_id}")
    return {"detail": "Sequence deleted successfully"}

# Collection Endpoints
@app.post("/collections", response_model=Collection)
async def create_collection(
    collection: CollectionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Creating collection for user: {current_user.username}")
    # Convert the current UTC time to MST
    utc_time = datetime.utcnow()
    mst_time = utc_time.astimezone(pytz.timezone("America/Denver"))
    
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
    logger.info(f"Collection created: {db_collection.name}")
    return db_collection

@app.get("/users/me/collections", response_model=List[CollectionRead])
async def get_collections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logger.info(f"Fetching collections for user: {current_user.username}")
    collections = current_user.collections
    logger.info(f"Found {len(collections)} collections")
    return collections

@app.get("/collections/{collection_id}/items")
async def get_collection_items(collection_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching items for collection: {collection_id}")
    items = db.query(Item).filter(Item.collection_id == collection_id).all()
    if not items:
        logger.info("No items found for collection")
        return []  
    logger.info(f"Found {len(items)} items for collection")
    return items

@app.put("/collections/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: int, 
    updated_collection: CollectionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Updating collection: {collection_id}")
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        logger.warning(f"Collection not found: {collection_id}")
        raise HTTPException(status_code=404, detail="Collection not found")
    for key, value in updated_collection.dict().items():
        setattr(db_collection, key, value)
    db.commit()
    db.refresh(db_collection)
    logger.info(f"Collection updated: {db_collection.name}")
    return db_collection

@app.delete("/collections/{collection_id}")
async def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting collection: {collection_id}")
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        logger.warning(f"Collection not found: {collection_id}")
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(db_collection)
    db.commit()
    logger.info(f"Collection deleted: {collection_id}")
    return {"detail": "Collection deleted successfully"}

@app.get("/collections/public", response_model=List[CollectionRead])
async def get_public_collections(db: Session = Depends(get_db)):
    logger.info("Fetching public collections")
    public_collections = db.query(Collection).filter(Collection.status == "public").all()
    
    for collection in public_collections:
        collection.items = db.query(Item).filter(Item.collection_id == collection.collection_id).all()
    
    logger.info(f"Found {len(public_collections)} public collections")
    return public_collections

@app.post("/collections/{collection_id}/items")
async def create_items(collection_id: int, items: List[str], db: Session = Depends(get_db)):
    logger.info(f"Adding items to collection: {collection_id}")
    try:
        add_items_to_collection(db, collection_id, items)
        logger.info(f"Items added to collection: {collection_id}")
        return {"message": "Items added successfully"}
    except Exception as e:
        logger.error(f"Error adding items to collection: {str(e)}", exc_info=True)
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
    logger.info(f"Subscribing to collection: {collection_id}")
    # Fetch the public collection
    public_collection = db.query(Collection).filter(Collection.collection_id == collection_id, Collection.status == "public").first()
    
    if not public_collection:
        logger.warning(f"Collection not found or not public: {collection_id}")
        raise HTTPException(status_code=404, detail="Collection not found or not public")

    # Check if the user has already subscribed to this collection
    existing_subscription = db.query(Collection).filter(Collection.name == public_collection.name, Collection.user_id == current_user.user_id).first()
    if existing_subscription:
        logger.warning(f"User already subscribed to collection: {collection_id}")
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
    logger.info(f"User subscribed to collection: {collection_id}")
    return new_collection

@app.post("/namelists/", response_model=NameListRead)
async def create_namelist(
    namelist: NameListCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Creating namelist for user: {current_user.username}")
    db_namelist = NameList(
        name=namelist.name,
        names=namelist.names,
        user_id=current_user.user_id
    )
    db.add(db_namelist)
    db.commit()
    db.refresh(db_namelist)
    logger.info(f"Namelist created: {db_namelist.name}")
    return db_namelist

@app.get("/namelists/", response_model=List[NameListRead])
async def get_namelists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Fetching namelists for user: {current_user.username}")
    namelists = db.query(NameList).filter(NameList.user_id == current_user.user_id).all()
    logger.info(f"Found {len(namelists)} namelists")
    return namelists

@app.put("/namelists/{namelist_id}", response_model=NameListRead)
async def update_namelist(
    namelist_id: int,
    updated_namelist: NameListCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating namelist: {namelist_id}")
    db_namelist = db.query(NameList).filter(NameList.namelist_id == namelist_id, NameList.user_id == current_user.user_id).first()
    if not db_namelist:
        logger.warning(f"Namelist not found: {namelist_id}")
        raise HTTPException(status_code=404, detail="NameList not found")
    
    db_namelist.name = updated_namelist.name
    db_namelist.names = updated_namelist.names
    db.commit()
    db.refresh(db_namelist)
    logger.info(f"Namelist updated: {db_namelist.name}")
    return db_namelist

@app.delete("/namelists/{namelist_id}")
async def delete_namelist(
    namelist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Deleting namelist: {namelist_id}")
    db_namelist = db.query(NameList).filter(NameList.namelist_id == namelist_id, NameList.user_id == current_user.user_id).first()
    if not db_namelist:
        logger.warning(f"Namelist not found: {namelist_id}")
        raise HTTPException(status_code=404, detail="NameList not found")
    
    db.delete(db_namelist)
    db.commit()
    logger.info(f"Namelist deleted: {namelist_id}")
    return {"detail": "NameList deleted successfully"}

@app.get("/collections/search", response_model=List[CollectionRead])
async def search_collections(
    query: str = Query(None, min_length=1),
    db: Session = Depends(get_db)
):
    logger.info(f"Searching collections for query: {query}")
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
    
    logger.info(f"Found {len(collections)} collections for query: {query}")
    return collections

@app.get("/health")
def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}

def create_db_and_tables():
    logger.info("Creating database and tables")
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
    logger.info("Database and tables created successfully")

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup event triggered")
    create_db_and_tables()
    logger.info("Application startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown event triggered")

if __name__ == "__main__":
    logger.info("Starting the application")
    create_db_and_tables()
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    logger.info(f"Starting Uvicorn server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")