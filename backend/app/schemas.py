from pydantic import BaseModel

class SequenceBase(BaseModel):
    name: str
    content: str

class SequenceCreate(SequenceBase):
    pass

class Sequence(SequenceBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    sequences: list[Sequence] = []

    class Config:
        orm_mode = True
