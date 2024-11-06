from models import SQLModel
from database import get_engine

def init_db():
    engine = get_engine()
    print('Creating database tables...')
    SQLModel.metadata.create_all(engine)
    print('Database tables created successfully!')

if __name__ == "__main__":
    init_db() 