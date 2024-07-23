from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session
from .models import User, Sequence
from .schemas import UserCreate, SequenceCreate
from .crud import get_user, get_user_by_username, create_user, get_sequences, create_user_sequence
from .database import init_db, get_session

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/users/", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_session)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_session)):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/{user_id}/sequences/", response_model=Sequence)
def create_sequence_for_user(user_id: int, sequence: SequenceCreate, db: Session = Depends(get_session)):
    return create_user_sequence(db=db, sequence=sequence, user_id=user_id)

@app.get("/sequences/", response_model=list[Sequence])
def read_sequences(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    sequences = get_sequences(db, skip=skip, limit=limit)
    return sequences
