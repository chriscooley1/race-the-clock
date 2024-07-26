from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import get_db
from models import User, UserCreate, Sequence, SequenceCreate
from typing import List

app = FastAPI()

@app.get("/users/{user_id}/sequences", response_model=List[Sequence])
async def get_sequences(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.sequences

@app.post("/sequences", response_model=Sequence)
async def create_sequence(sequence: SequenceCreate, db: Session = Depends(get_db)):
    db_sequence = Sequence.from_orm(sequence)
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
