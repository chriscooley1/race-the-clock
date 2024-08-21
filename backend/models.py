from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import sqlalchemy as sa  

class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str  # Add password field

# User Models
class UserBase(SQLModel):
    username: str
    email: Optional[str]

class User(SQLModel, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column=sa.Column(sa.String, unique=True, index=True))
    email: Optional[str] = Field(default=None)
    hashed_password: str = Field(sa_column=sa.Column(sa.String, nullable=False))  # Add this line
    sequences: List["Sequence"] = Relationship(back_populates="user")
    collections: List["Collection"] = Relationship(back_populates="user")

# Sequence Models
class SequenceBase(SQLModel):
    name: str
    description: str
    user_id: int

class Sequence(SequenceBase, table=True):
    __tablename__ = "sequences"
    sequence_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    user: User = Relationship(back_populates="sequences")

class SequenceCreate(SequenceBase):
    pass

# Collection Models
class CollectionBase(SQLModel):
    name: str
    description: str
    user_id: int

class Collection(SQLModel, table=True):
    __tablename__ = "collections"
    collection_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    user_id: int = Field(foreign_key="users.user_id")
    status: str = Field(default="private")
    user: User = Relationship(back_populates="collections")
    items: List["Item"] = Relationship(back_populates="collection")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionCreate(SQLModel):
    name: str
    description: str
    status: Optional[str] = "private"

class CollectionRead(CollectionBase):
    collection_id: int
    created_at: datetime
    status: str

# Item Models
class ItemBase(SQLModel):
    name: str
    collection_id: int

class Item(ItemBase, table=True):
    __tablename__ = "items"
    item_id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: int = Field(foreign_key="collections.collection_id")
    collection: "Collection" = Relationship(back_populates="items")

class ItemCreate(ItemBase):
    pass

class ItemRead(SQLModel):
    item_id: int
    name: str
    collection_id: int
