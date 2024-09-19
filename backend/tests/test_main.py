import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel
from main import app, create_db_and_tables
from database import get_engine, get_db

# Remove the import of 'engine' from main, as it's no longer there

@pytest.fixture(scope="module")
def client():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
    
    def get_session_override():
        return Session(engine)
    
    app.dependency_overrides[get_db] = get_session_override
    
    with TestClient(app) as client:
        yield client
    
    SQLModel.metadata.drop_all(engine)
    app.dependency_overrides.clear()

@pytest.fixture
def session():
    with Session(get_engine()) as session:
        yield session

@pytest.mark.asyncio
async def test_health_check(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

# User Endpoints
@pytest.mark.asyncio
async def test_create_user(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        response = await ac.post("/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_read_users_me(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/me/")
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

# Sequence Endpoints
@pytest.mark.asyncio
async def test_create_sequence(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        sequence_data = {"name": "testsequence", "description": "A test sequence", "user_id": "testuser"}
        response = await ac.post("/sequences", json=sequence_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testsequence"

@pytest.mark.asyncio
async def test_get_sequences(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/testuser/sequences")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Collection Endpoints
@pytest.mark.asyncio
async def test_create_collection(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        collection_data = {"name": "testcollection", "description": "A test collection", "category": "test"}
        response = await ac.post("/collections", json=collection_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testcollection"

@pytest.mark.asyncio
async def test_get_collections(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/me/collections")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# NameList Endpoints
@pytest.mark.asyncio
async def test_create_namelist(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        namelist_data = {"name": "testnamelist", "names": ["name1", "name2"]}
        response = await ac.post("/namelists/", json=namelist_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testnamelist"

@pytest.mark.asyncio
async def test_get_namelists(client):
    async with AsyncClient(app=client, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/namelists/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
