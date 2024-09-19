import os
import pytest
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from main import app
from database import get_db, get_engine

# Set the TESTING environment variable
os.environ["TESTING"] = "True"

# Get the test engine
test_engine = get_engine()

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    SQLModel.metadata.create_all(test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)

@pytest.fixture(scope="function")
def db_session():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient
    yield TestClient(app)
    del app.dependency_overrides[get_db]
