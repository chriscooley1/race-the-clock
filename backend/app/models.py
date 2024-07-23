from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class UserBase(SQLModel):
    username: str

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    sequences: List["Sequence"] = Relationship(back_populates="owner")

class SequenceBase(SQLModel):
    name: str
    content: str

class Sequence(SequenceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="sequences")
