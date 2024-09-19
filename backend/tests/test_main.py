import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, select
from main import app, get_current_user
from database import get_engine, get_db
from models import User
import jwt

# Remove the import of "engine" from main, as it's no longer there

@pytest.fixture(scope="module")
def engine():
    return get_engine()

@pytest.fixture(scope="module")
def session(engine):
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(scope="module")
def client(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def mock_auth0_token():
    # Create a mock Auth0 token
    payload = {
        "sub": "auth0|testuser",
        "email": "testuser@example.com"
    }
    token = jwt.encode(payload, "secret", algorithm="HS256")
    return f"Bearer {token}"

@pytest.fixture(scope="module")
def authenticated_client(client, session, mock_auth0_token):
    # Create a test user in the database
    user = User(username="auth0|testuser", email="testuser@example.com", hashed_password="")
    session.add(user)
    session.commit()
    session.refresh(user)
    print(f"Created test user: {user.username}, ID: {user.user_id}")

    # Override the get_current_user dependency
    def override_get_current_user():
        print("get_current_user called")
        db_user = session.exec(select(User).where(User.username == "auth0|testuser")).first()
        print(f"Retrieved user from database: {db_user}")
        return db_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Create a new client with authentication headers
    client.headers.update({"Authorization": mock_auth0_token})
    return client

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

# User Endpoints
def test_create_user(client):
    user_data = {"username": "newuser", "email": "newuser@example.com", "password": "newpassword"}
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["username"] == "newuser"

def test_read_users_me(authenticated_client):
    response = authenticated_client.get("/users/me/")
    assert response.status_code == 200
    user_data = response.json()
    assert "email" in user_data  # Change this based on what your endpoint actually returns
    assert user_data["email"] == "testuser@example.com"

# Sequence Endpoints
def test_create_sequence(authenticated_client, session):
    user = session.exec(select(User).where(User.username == "auth0|testuser")).first()
    sequence_data = {
        "name": "testsequence",
        "description": "A test sequence",
        "user_id": user.username  # Use the username as user_id
    }
    response = authenticated_client.post("/sequences", json=sequence_data)
    assert response.status_code == 200, f"Response: {response.json()}"
    assert response.json()["name"] == "testsequence"

def test_get_sequences(authenticated_client):
    print("Starting test_get_sequences")
    
    user_response = authenticated_client.get("/users/me/")
    assert user_response.status_code == 200, f"Failed to get user data: {user_response.content}"
    user = user_response.json()
    print(f"User data: {user}")

    username = user["username"]
    print(f"Fetching sequences for username: {username}")
    
    response = authenticated_client.get(f"/users/{username}/sequences")
    assert response.status_code == 200, f"Response: {response.json()}"
    sequences = response.json()
    print(f"Sequences: {sequences}")
    assert isinstance(sequences, list)

# Collection Endpoints
def test_create_collection(authenticated_client):
    collection_data = {
        "name": "testcollection",
        "description": "A test collection",
        "category": "test",
        "status": "private"
    }
    response = authenticated_client.post("/collections/", json=collection_data)
    assert response.status_code == 200, f"Response: {response.json()}"
    assert response.json()["name"] == "testcollection"

def test_get_collections(authenticated_client):
    response = authenticated_client.get("/users/me/collections")
    assert response.status_code == 200, f"Response: {response.json()}"
    assert isinstance(response.json(), list)

# NameList Endpoints
def test_create_namelist(authenticated_client):
    namelist_data = {"name": "testnamelist", "names": ["name1", "name2"]}
    response = authenticated_client.post("/namelists/", json=namelist_data)
    assert response.status_code == 200, f"Response: {response.json()}"
    assert response.json()["name"] == "testnamelist"

def test_get_namelists(authenticated_client):
    response = authenticated_client.get("/namelists/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
