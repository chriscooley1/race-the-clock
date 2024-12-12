from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel
import pytz
import sqlalchemy as sa
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.postgresql import JSON

# Add this custom type for Mountain Time
class MountainDateTime(TypeDecorator):
    impl = DateTime
    cache_ok = True
    
    def process_bind_param(self, value, dialect):
        if value is not None:
            # Check if the datetime is naive (has no timezone)
            if value.tzinfo is None:
                # If naive, assume it's in Mountain Time and make it aware
                mountain_tz = pytz.timezone("America/Denver")
                value = mountain_tz.localize(value)
            return value.astimezone(pytz.UTC)
            
    def process_result_value(self, value, dialect):
        if value is not None:
            if value.tzinfo is None:
                value = pytz.UTC.localize(value)
            return value.astimezone(pytz.timezone("America/Denver"))

class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str  # Add password field

# Define a Pydantic model for the request body
class DisplayNameUpdate(BaseModel):
    display_name: str

# NameList Models
class NameList(SQLModel, table=True):
    __tablename__ = "namelists"
    namelist_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    names: List[str] = Field(sa_column=sa.Column(sa.JSON))
    user_id: int = Field(foreign_key="users.user_id")
    user: "User" = Relationship(back_populates="namelists")

class NameListCreate(BaseModel):
    name: str
    names: List[str]

# Add this new model
class NameListRead(BaseModel):
    namelist_id: int
    name: str
    names: List[str]
    user_id: int

class UserBase(SQLModel):
    username: str
    email: Optional[str]

class User(SQLModel, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    auth0_id: str = Field(sa_column=sa.Column(sa.String, unique=True, index=True))
    username: str = Field(sa_column=sa.Column(sa.String, unique=True, index=True))
    email: Optional[str] = Field(default=None)
    hashed_password: str = Field(sa_column=sa.Column(sa.String, nullable=False))
    display_name: Optional[str] = Field(default=None)
    sequences: List["Sequence"] = Relationship(back_populates="user")
    collections: List["Collection"] = Relationship(back_populates="user")
    namelists: List[NameList] = Relationship(back_populates="user")
    role: str = Field(default="student")
    completions: List["CompletionRecord"] = Relationship(back_populates="user")

# Add this class for role updates
class RoleUpdate(BaseModel):
    role: str

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

class SequenceCreate(SQLModel):
    name: str
    description: str
    user_id: str  # Change this to str to match the username

# Collection Models
class CollectionBase(SQLModel):
    name: str
    description: str
    user_id: int
    category: str = Field(..., description="Category of the collection")
    # stage: str = Field(default="beginner", description="Stage of mastery: beginner, intermediate, advanced")  # Keep this line commented out for future use

class Collection(SQLModel, table=True):
    __tablename__ = "collections"
    collection_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    user_id: int = Field(foreign_key="users.user_id")
    status: str = Field(default="private")
    category: str
    is_public: bool = Field(default=False)
    creator_display_name: Optional[str] = None
    creator_username: Optional[str] = None
    user: User = Relationship(back_populates="collections")
    items: List["Item"] = Relationship(
        back_populates="collection",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completions: List["CompletionRecord"] = Relationship(
        back_populates="collection",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class CollectionCreate(SQLModel):
    name: str
    description: str
    status: Optional[str] = "private"
    category: str
    stage: Optional[str] = "beginner"  # Add this line

class CollectionRead(CollectionBase):
    collection_id: int
    created_at: datetime
    status: str
    creator_display_name: Optional[str] = None
    creator_username: Optional[str] = None

class CollectionUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    is_public: Optional[bool] = None

# Item Models
class ItemBase(SQLModel):
    name: str
    collection_id: int

class Item(ItemBase, table=True):
    __tablename__ = "items"
    item_id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: int = Field(foreign_key="collections.collection_id")
    collection: "Collection" = Relationship(back_populates="items")
    count: Optional[int] = Field(default=1)

class ItemCreate(ItemBase):
    pass

class ItemRead(SQLModel):
    item_id: int
    name: str
    collection_id: int

class Feedback(SQLModel, table=True):
    __tablename__ = "feedback"
    id: Optional[int] = Field(default=None, primary_key=True)
    message: str = Field(...)
    page_url: str = Field(...)
    created_at: datetime = Field(
        sa_column=Column(MountainDateTime, default=lambda: datetime.now(timezone("America/Denver")))
    )
    user_id: Optional[int] = Field(default=None, foreign_key="users.user_id")
    image_paths: List[str] = Field(default_factory=list, sa_column=Column(JSON))

class CompletionRecord(SQLModel, table=True):
    __tablename__ = "completion_records"
    id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: int = Field(foreign_key="collections.collection_id")
    user_id: int = Field(foreign_key="users.user_id")
    completed_at: datetime = Field(
        sa_column=Column(MountainDateTime, default=lambda: datetime.now(timezone("America/Denver")))
    )
    collection: Collection = Relationship(back_populates="completions")
    user: User = Relationship(back_populates="completions")

class ReportResponse(BaseModel):
    report_id: int
    user_id: int
    total_items: int
    time_taken: float
    missed_items: int
    skipped_items: int
    created_at: datetime