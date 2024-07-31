from sqlmodel import Field, SQLModel, Relationship
from typing import List, Optional

class UserBase(SQLModel):
    username: str
    email: Optional[str]
    hashed_password: str

class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    sequences: List["Sequence"] = Relationship(back_populates="user")
    collections: List["Collection"] = Relationship(back_populates="user")

class UserCreate(SQLModel):
    username: str
    password: str

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

class CollectionBase(SQLModel):
    name: str
    description: str
    user_id: int

class Collection(CollectionBase, table=True):
    __tablename__ = "collections"
    collection_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    user: User = Relationship(back_populates="collections")

class CollectionCreate(CollectionBase):
    pass
