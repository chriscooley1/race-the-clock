import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session
from .models import User, Sequence
from .schemas import UserCreate, SequenceCreate
from .crud import get_user, get_user_by_username, create_user, get_sequences, create_user_sequence
from .database import engine, get_session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for the frontend origin
origins = [
    "http://localhost:5175",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/users/", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_session)):
    try:
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        return create_user(db=db, user=user)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_session)):
    try:
        db_user = get_user(db, user_id=user_id)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return db_user
    except Exception as e:
        logger.error(f"Error reading user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/users/{user_id}/sequences/", response_model=Sequence)
def create_sequence_for_user(user_id: int, sequence: SequenceCreate, db: Session = Depends(get_session)):
    try:
        return create_user_sequence(db=db, sequence=sequence, user_id=user_id)
    except Exception as e:
        logger.error(f"Error creating sequence: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/sequences/", response_model=list[Sequence])
def read_sequences(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    try:
        sequences = get_sequences(db, skip=skip, limit=limit)
        return sequences
    except Exception as e:
        logger.error(f"Error reading sequences: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
