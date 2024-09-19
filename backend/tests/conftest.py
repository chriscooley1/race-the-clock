import os
import sys
import pytest
from sqlmodel import SQLModel, Session, create_engine
from fastapi.testclient import TestClient
from main import app, get_db

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set the TESTING environment variable
os.environ["TESTING"] = "True"

# Create a test database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create the test database and tables
@pytest.fixture(scope="module", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)

# Provide a database session for each test
@pytest.fixture
def session():
    with Session(engine) as session:
        yield session

# Override the get_db dependency to use the test database
def override_get_db():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

# Provide a test client for the FastAPI app
@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client
