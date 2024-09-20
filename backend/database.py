import os
from sqlmodel import Session, create_engine
from decouple import config
from sqlalchemy.engine.url import make_url

def get_database_url():
    if os.environ.get("TESTING") == "True":
        return "sqlite:///./test.db"
    elif os.environ.get("DATABASE_URL"):
        return os.environ.get("DATABASE_URL")
    else:
        # Fallback for local development
        return f"postgresql://{config('POSTGRES_USER')}:{config('POSTGRES_PASSWORD')}@localhost:5432/{config('POSTGRES_DB')}"

def get_engine():
    database_url = get_database_url()
    url = make_url(database_url)
    if url.drivername.startswith("sqlite"):
        return create_engine(database_url, connect_args={"check_same_thread": False})
    else:
        return create_engine(
            database_url,
            pool_size=10,
            max_overflow=20,
            pool_timeout=30,
            pool_recycle=3600,
            connect_args={"options": "-c timezone=America/Denver"}
        )

engine = get_engine()

def get_db():
    with Session(engine) as session:
        yield session
