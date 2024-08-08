from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import User, UserCreate, Sequence, SequenceCreate, Collection, CollectionCreate, CollectionRead

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this list to match your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Authentication helpers
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # Refresh to get the updated object
    return {"message": "User registered successfully", "user_id": db_user.user_id}

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/users", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, hashed_password=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}/sequences", response_model=List[Sequence])
async def get_sequences(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.sequences

@app.post("/sequences", response_model=Sequence)
async def create_sequence(sequence: SequenceCreate, db: Session = Depends(get_db)):
    print("Received data:", sequence.dict())  # Debugging line
    user = db.get(User, sequence.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    db_sequence = Sequence(
        name=sequence.name,
        description=sequence.description,
        user_id=sequence.user_id
    )
    db.add(db_sequence)
    db.commit()
    db.refresh(db_sequence)
    return db_sequence

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

@app.post("/collections", response_model=Collection)
async def create_collection(collection: CollectionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("Creating a new collection...")  # Debugging line
    db_collection = Collection(
        name=collection.name,
        description=collection.description,
        user_id=current_user.user_id  # Use the current user's ID
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.get("/users/me/collections", response_model=List[CollectionRead])
async def get_collections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.collections

@app.put("/collections/{collection_id}", response_model=Collection)
async def update_collection(collection_id: int, updated_collection: CollectionCreate, db: Session = Depends(get_db)):
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    for key, value in updated_collection.dict().items():
        setattr(db_collection, key, value)
    db.commit()
    db.refresh(db_collection)
    print(f"Collection updated: {db_collection}")  # Debugging line
    return db_collection

@app.delete("/collections/{collection_id}")
async def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.get(Collection, collection_id)
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(db_collection)
    db.commit()
    print(f"Collection deleted: {db_collection}")  # Debugging line
    return {"detail": "Collection deleted successfully"}
