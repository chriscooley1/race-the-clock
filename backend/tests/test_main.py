import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["TESTING"] = "True"

import pytest
from httpx import AsyncClient
from sqlmodel import SQLModel, Session
from main import app, engine, create_db_and_tables
from models import UserCreate, SequenceCreate, CollectionCreate, NameListCreate

@pytest.fixture(scope="module")
def test_app():
    create_db_and_tables()
    yield app
    SQLModel.metadata.drop_all(engine)

@pytest.fixture
def session():
    with Session(engine) as session:
        yield session

@pytest.mark.asyncio
async def test_health_check(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

# User Endpoints
@pytest.mark.asyncio
async def test_create_user(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        response = await ac.post("/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_read_users_me(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/me/")
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

# Sequence Endpoints
@pytest.mark.asyncio
async def test_create_sequence(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        sequence_data = {"name": "testsequence", "description": "A test sequence", "user_id": "testuser"}
        response = await ac.post("/sequences", json=sequence_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testsequence"

@pytest.mark.asyncio
async def test_get_sequences(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/testuser/sequences")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Collection Endpoints
@pytest.mark.asyncio
async def test_create_collection(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        collection_data = {"name": "testcollection", "description": "A test collection", "category": "test"}
        response = await ac.post("/collections", json=collection_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testcollection"

@pytest.mark.asyncio
async def test_get_collections(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/users/me/collections")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# NameList Endpoints
@pytest.mark.asyncio
async def test_create_namelist(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        namelist_data = {"name": "testnamelist", "names": ["name1", "name2"]}
        response = await ac.post("/namelists/", json=namelist_data)
    assert response.status_code == 200
    assert response.json()["name"] == "testnamelist"

@pytest.mark.asyncio
async def test_get_namelists(test_app):
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        user_data = {"username": "testuser", "email": "testuser@example.com", "password": "password"}
        await ac.post("/users/", json=user_data)
        response = await ac.get("/namelists/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
