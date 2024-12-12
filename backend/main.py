from fastapi import FastAPI, Depends, HTTPException, status, Header, Query, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
from models import (
    User, 
    Sequence, 
    SequenceCreate, 
    Collection, 
    CollectionCreate, 
    CollectionRead, 
    CollectionUpdate,
    Item, 
    UserCreate, 
    DisplayNameUpdate, 
    NameList, 
    NameListCreate, 
    NameListRead, 
    Feedback,
    CompletionRecord,
    ReportResponse
)
from jose import jwt, jwk
from jose.exceptions import JWKError, ExpiredSignatureError, JWTClaimsError, JWTError
from datetime import datetime, timedelta
from typing import List, Optional, Dict
import logging
import os
from passlib.context import CryptContext
import requests
from pytz import timezone
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import time
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import pytz
from pydantic import BaseModel
from github_integration import GitHubIssueCreator
import json
from sqlalchemy import func
import shutil

from database import get_db, get_engine

# Load environment variables from .env file
load_dotenv()

# Set up environment configuration directly
DATABASE_URL = os.environ.get("DATABASE_URL")
AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.environ.get("AUTH0_AUDIENCE")
SECRET_KEY = os.environ.get("SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://www.race-the-clock.com")
LOCAL_FRONTEND_URL = os.environ.get("LOCAL_FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [FRONTEND_URL, LOCAL_FRONTEND_URL]
ALGORITHM = "HS256"

# Add this line to define TIMEZONE
TIMEZONE = timezone("America/Denver")  # This is for Mountain Time

TESTING = os.environ.get("TESTING", "False") == "True"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Add this CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single middleware function to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Received request: {request.method}")
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Error processing request: {type(e).__name__}")
        raise

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
        
        if not rsa_key:
            raise credentials_exception
            
        payload = jwt.decode(
            token,
            jwk.construct(rsa_key),
            algorithms=[rsa_key["alg"]],
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
        
        username: str = payload.get("sub")
        email: str = payload.get("email")
        name: str = payload.get("name", "").strip()
        
        # Clean up the name if it contains the Auth0 ID
        if name and "|" in name:
            name = name.split("|")[1].strip()
        
        user = db.query(User).filter(User.username == username).first()
        
        if user is None:
            # Create new user with proper display name
            user = User(
                username=username,
                email=email,
                display_name=name or email or username.split("|")[1],
                hashed_password="",
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not user.display_name or user.display_name == username or "|" in user.display_name:
            # Update existing user's display name if it's not set or contains Auth0 ID
            user.display_name = name or email or username.split("|")[1]
            db.commit()
            db.refresh(user)
        
        logger.info("Fetched current user.")
        return user
    except Exception as e:
        logger.error(f"Error in get_current_user: {type(e).__name__}")
        raise credentials_exception

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
    mst_time = datetime.now(TIMEZONE)
    
    db_collection = Collection(
        name=collection.name,
        description=collection.description,
        status=collection.status or "private",  
        category=collection.category,
        user_id=current_user.user_id,
        created_at=mst_time
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)

    # Parse the collection data from the description field
    try:
        items_data = json.loads(collection.description)
        for item_data in items_data:
            db_item = Item(
                name=item_data["name"],
                collection_id=db_collection.collection_id,
                count=item_data.get("count", 1)  # Default to 1 if count is not provided
            )
            db.add(db_item)
        db.commit()
    except json.JSONDecodeError:
        logger.error("Failed to parse collection items data")
        raise HTTPException(status_code=400, detail="Invalid items data format")

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
    collection_data: CollectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Get the existing collection
        db_collection = db.query(Collection).filter(
            Collection.collection_id == collection_id,
            Collection.user_id == current_user.user_id
        ).first()
        
        if not db_collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Update only the fields that are provided
        update_data = collection_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_collection, key, value)
        
        db.commit()
        db.refresh(db_collection)
        return db_collection
        
    except Exception as e:
        logger.error(f"Error updating collection: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating collection")

@app.delete("/collections/{collection_id}")
async def delete_collection(
    collection_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # First verify the collection exists and belongs to the user
        db_collection = db.query(Collection).filter(
            Collection.collection_id == collection_id,
            Collection.user_id == current_user.user_id
        ).first()
        
        if not db_collection:
            raise HTTPException(status_code=404, detail="Collection not found")

        # Log the deletion attempt
        logger.info(f"Attempting to delete collection {collection_id} for user {current_user.user_id}")
        
        # Delete completion records first
        db.query(CompletionRecord).filter(
            CompletionRecord.collection_id == collection_id
        ).delete(synchronize_session=False)
        
        # Then delete the collection
        db.delete(db_collection)
        db.commit()
        
        logger.info(f"Successfully deleted collection {collection_id}")
        return {"detail": "Collection deleted successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting collection {collection_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to delete collection: {str(e)}"
        )

@app.get("/collections/public", response_model=List[CollectionRead])
async def get_public_collections(db: Session = Depends(get_db)):
    collections = db.query(Collection).join(User).filter(
        Collection.status == "public"
    ).all()
    
    # Enhance collections with creator information
    for collection in collections:
        collection.creator_display_name = collection.user.display_name
        collection.creator_username = collection.user.username
    
    return collections

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
    
    # Drop all tables if they exist
    SQLModel.metadata.drop_all(engine)
    
    # Create all tables fresh
    SQLModel.metadata.create_all(engine)
    
    # Log the table creation
    logger.info("Database tables created successfully")

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

# Add this new endpoint
@app.get("/collections/check-subscription/{collection_id}")
async def check_subscription(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if the user has a private copy of this collection
    subscription = db.query(Collection).filter(
        Collection.user_id == current_user.user_id,
        Collection.collection_id == collection_id
    ).first()
    
    return {"isSubscribed": subscription is not None}

class RoleUpdate(BaseModel):
    role: str

@app.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role_update: RoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate role
    if role_update.role not in ["student", "teacher"]:
        raise HTTPException(status_code=422, detail="Invalid role")
    
    # Find user by username (which contains the auth0 id)
    user = db.query(User).filter(User.username == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404, 
            detail=f"User not found"
        )
    
    # Update role
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    
    return user

def init_db():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)

@app.post("/init-db")
async def initialize_database():
    engine = get_engine()
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    return {"message": "Database initialized"}

# Only add this if NODE_ENV is development
if os.environ.get("NODE_ENV") == "development":
    @app.post("/dev/init-db")
    async def init_dev_db():
        """Development only endpoint to initialize the database"""
        engine = get_engine()
        SQLModel.metadata.create_all(engine)
        return {"message": "Development database initialized"}

@app.get("/db-info")
async def get_db_info(db: Session = Depends(get_db)):
    try:
        # Use text() to declare the SQL expression
        tables = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
        
        db_info = {}
        for table in tables:
            table_name = table[0]
            # Fetch all rows from the table
            data = db.execute(text(f"SELECT * FROM {table_name}")).fetchall()
            # Convert rows to a list of dictionaries
            db_info[table_name] = [dict(zip(row.keys(), row)) for row in data]
        
        return db_info
    except Exception as e:
        logger.error(f"Error fetching database info: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Instead, create a function to get or create the GitHub issue creator
def get_github_issue_creator():
    if not hasattr(get_github_issue_creator, "_instance"):
        try:
            get_github_issue_creator._instance = GitHubIssueCreator()
        except ValueError:
            logger.warning("GitHub integration disabled - configuration missing")
            get_github_issue_creator._instance = None
    return get_github_issue_creator._instance

# Update the feedback endpoint
@app.post("/api/feedback")
async def submit_feedback(
    message: str = Form(...),
    page_url: str = Form(...),
    display_name: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    logger.info("Received feedback from user.")
    try:
        # Create new Feedback instance with Mountain Time
        current_time = datetime.now(TIMEZONE)
        
        # Save images if provided
        image_paths = []
        if files:
            upload_dir = "uploads/feedback_images"
            os.makedirs(upload_dir, exist_ok=True)
            
            for file in files:
                file_path = f"{upload_dir}/{current_time.strftime('%Y%m%d_%H%M%S')}_{file.filename}"
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                image_paths.append(file_path)
        
        feedback = Feedback(
            message=message,
            page_url=page_url,
            created_at=current_time,
            user_id=None,
            image_paths=image_paths
        )
        
        db.add(feedback)
        db.commit()
        db.refresh(feedback)

        # Create GitHub issue with images
        github_creator = get_github_issue_creator()
        if github_creator:
            try:
                issue_number = github_creator.create_feedback_issue({
                    "message": message,
                    "page_url": page_url,
                    "created_at": current_time.strftime("%Y-%m-%d %H:%M:%S MST"),
                    "display_name": display_name,
                    "image_paths": image_paths
                })
                logger.info(f"Created GitHub issue #{issue_number} for feedback")
            except Exception as e:
                logger.error(f"Failed to create GitHub issue: {str(e)}")
        
        return {"status": "success", "message": "Feedback submitted successfully"}
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Replace the existing logging setup with this:
TIMEZONE = timezone("America/Denver")

class MountainTimeFormatter(logging.Formatter):
    def converter(self, timestamp):
        dt = datetime.fromtimestamp(timestamp)
        return TIMEZONE.localize(dt)

    def formatTime(self, record, datefmt=None):
        dt = self.converter(record.created)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.isoformat()

# Clear any existing handlers
logging.getLogger().handlers = []

# Configure root logger
logger = logging.getLogger("main")
logger.setLevel(logging.INFO)
logger.handlers = []  # Clear any existing handlers

# Add single handler with Mountain Time formatting
handler = logging.StreamHandler()
handler.setFormatter(MountainTimeFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

class CollectionIdsRequest(BaseModel):
    collection_ids: List[int]

@app.post("/collections/check-subscriptions-batch", response_model=Dict[str, bool])
async def check_subscriptions_batch(
    request: CollectionIdsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        subscriptions = db.query(Collection).filter(
            Collection.user_id == current_user.user_id,
            Collection.collection_id.in_(request.collection_ids)
        ).all()
        
        return {
            str(collection.collection_id): True 
            for collection in subscriptions
        }
    except Exception as e:
        logger.error(f"Error checking subscriptions batch: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking subscriptions")

@app.get("/collections/completion-counts")
async def get_completion_counts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        counts = db.query(Collection.collection_id, func.count(CompletionRecord.id))\
                  .join(CompletionRecord, Collection.collection_id == CompletionRecord.collection_id)\
                  .filter(CompletionRecord.user_id == current_user.user_id)\
                  .group_by(Collection.collection_id)\
                  .all()
        
        return {str(cid): count for cid, count in counts}
    except Exception as e:
        logger.error(f"Error fetching completion counts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching completion counts")

# Add this endpoint before the if __name__ == "__main__": block
@app.get("/reports", response_model=List[ReportResponse])
async def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),  # Page number, default to 1
    limit: int = Query(10, ge=1, le=50)  # Limit per page, default 10, max 50
):
    try:
        # Calculate offset
        offset = (page - 1) * limit

        # Query with pagination
        completion_records = db.query(CompletionRecord, Collection)\
            .join(Collection, CompletionRecord.collection_id == Collection.collection_id)\
            .filter(CompletionRecord.user_id == current_user.user_id)\
            .order_by(CompletionRecord.completed_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()

        logger.info(f"Fetched {len(completion_records)} completion records for user {current_user.user_id}")

        reports = []
        for i, (record, collection) in enumerate(completion_records):
            # Get items count for this collection
            items_count = db.query(func.count(Item.item_id))\
                .filter(Item.collection_id == collection.collection_id)\
                .scalar() or 0
                
            report = ReportResponse(
                report_id=offset + i + 1,
                user_id=current_user.user_id,
                total_items=items_count,
                time_taken=60.0,  # Placeholder, should be calculated dynamically
                missed_items=0,
                skipped_items=0,
                created_at=record.completed_at
            )
            reports.append(report)

        # Get total count for pagination metadata
        total_count = db.query(func.count(CompletionRecord.id))\
            .filter(CompletionRecord.user_id == current_user.user_id)\
            .scalar()

        return {
            "reports": reports,
            "total_count": total_count,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching reports: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")

@app.post("/collections/{collection_id}/complete")
async def complete_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        completion_record = CompletionRecord(
            collection_id=collection_id,
            user_id=current_user.user_id,
            completed_at=datetime.now(timezone("America/Denver"))
        )
        db.add(completion_record)
        db.commit()
        logger.info(f"Created completion record: collection_id={collection_id}, user_id={current_user.user_id}")
        return {"message": "Collection completion recorded successfully"}
    except Exception as e:
        logger.error(f"Error recording completion: {str(e)}")
        raise HTTPException(status_code=500, detail="Error recording completion")

if __name__ == "__main__":
    init_db()
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
