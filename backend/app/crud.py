from sqlmodel import Session, select
from .models import User, Sequence
from .schemas import UserCreate, SequenceCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.get(User, user_id)

def get_user_by_username(db: Session, username: str):
    statement = select(User).where(User.username == username)
    return db.exec(statement).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_sequences(db: Session, skip: int = 0, limit: int = 10):
    statement = select(Sequence).offset(skip).limit(limit)
    return db.exec(statement).all()

def create_user_sequence(db: Session, sequence: SequenceCreate, user_id: int):
    db_sequence = Sequence(name=sequence.name, content=sequence.content, owner_id=user_id)
    db.add(db_sequence)
    db.commit()
    db.refresh(db_sequence)
    return db_sequence
