#!/bin/bash
python3 -c "
from models import SQLModel
from database import engine
print('Creating database tables...')
SQLModel.metadata.create_all(engine)
print('Database tables created successfully!')
" 