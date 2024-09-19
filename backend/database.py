import os
from sqlmodel import Session, create_engine
from decouple import config

def get_database_url():
    if os.environ.get("TESTING") == "True":
        return "sqlite:///./test.db"
    else:
        return config("DATABASE_URL")

def get_engine():
    database_url = get_database_url()
    if database_url.startswith("sqlite"):
        return create_engine(database_url, connect_args={"check_same_thread": False})
    else:
        return create_engine(
            database_url,
            pool_size=10,
            max_overflow=20,
            pool_timeout=30,
            pool_recycle=3600
        )

engine = get_engine()

def get_db():
    with Session(engine) as session:
        yield session
