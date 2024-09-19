import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["TESTING"] = "True"

import pytest
from httpx import AsyncClient
from sqlmodel import SQLModel, Session
from main import app, engine, create_db_and_tables

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
