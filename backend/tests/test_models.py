import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["TESTING"] = "True"

import pytest
from sqlmodel import SQLModel, Session, create_engine
from models import User, UserCreate, Sequence, SequenceCreate, Collection, CollectionCreate, Item, ItemCreate, NameList, NameListCreate

# Create a test database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

@pytest.fixture(scope="module", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)

@pytest.fixture
def session():
    with Session(engine) as session:
        yield session

# User Model Tests
def test_create_user(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.user_id is not None
    assert user.username == "testuser"

def test_read_user(session):
    user = session.query(User).filter(User.username == "testuser").first()
    assert user is not None
    assert user.username == "testuser"

def test_update_user(session):
    user = session.query(User).filter(User.username == "testuser").first()
    user.email = "newemail@example.com"
    session.commit()
    session.refresh(user)
    assert user.email == "newemail@example.com"

def test_delete_user(session):
    user = session.query(User).filter(User.username == "testuser").first()
    session.delete(user)
    session.commit()
    user = session.query(User).filter(User.username == "testuser").first()
    assert user is None

# Sequence Model Tests
def test_create_sequence(session):
    user = User(username="testuser2", email="testuser2@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    session.refresh(user)
    sequence = Sequence(name="testsequence", description="A test sequence", user_id=user.user_id)
    session.add(sequence)
    session.commit()
    session.refresh(sequence)
    assert sequence.sequence_id is not None
    assert sequence.name == "testsequence"

def test_read_sequence(session):
    sequence = session.query(Sequence).filter(Sequence.name == "testsequence").first()
    assert sequence is not None
    assert sequence.name == "testsequence"

def test_update_sequence(session):
    sequence = session.query(Sequence).filter(Sequence.name == "testsequence").first()
    sequence.description = "Updated description"
    session.commit()
    session.refresh(sequence)
    assert sequence.description == "Updated description"

def test_delete_sequence(session):
    sequence = session.query(Sequence).filter(Sequence.name == "testsequence").first()
    session.delete(sequence)
    session.commit()
    sequence = session.query(Sequence).filter(Sequence.name == "testsequence").first()
    assert sequence is None

# Collection Model Tests
def test_create_collection(session):
    user = session.query(User).filter(User.username == "testuser2").first()
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    session.refresh(collection)
    assert collection.collection_id is not None
    assert collection.name == "testcollection"

def test_read_collection(session):
    collection = session.query(Collection).filter(Collection.name == "testcollection").first()
    assert collection is not None
    assert collection.name == "testcollection"

def test_update_collection(session):
    collection = session.query(Collection).filter(Collection.name == "testcollection").first()
    collection.description = "Updated description"
    session.commit()
    session.refresh(collection)
    assert collection.description == "Updated description"

def test_delete_collection(session):
    collection = session.query(Collection).filter(Collection.name == "testcollection").first()
    session.delete(collection)
    session.commit()
    collection = session.query(Collection).filter(Collection.name == "testcollection").first()
    assert collection is None

# Item Model Tests
def test_create_item(session):
    collection = session.query(Collection).filter(Collection.name == "testcollection").first()
    item = Item(name="testitem", collection_id=collection.collection_id)
    session.add(item)
    session.commit()
    session.refresh(item)
    assert item.item_id is not None
    assert item.name == "testitem"

def test_read_item(session):
    item = session.query(Item).filter(Item.name == "testitem").first()
    assert item is not None
    assert item.name == "testitem"

def test_update_item(session):
    item = session.query(Item).filter(Item.name == "testitem").first()
    item.name = "updateditem"
    session.commit()
    session.refresh(item)
    assert item.name == "updateditem"

def test_delete_item(session):
    item = session.query(Item).filter(Item.name == "testitem").first()
    session.delete(item)
    session.commit()
    item = session.query(Item).filter(Item.name == "testitem").first()
    assert item is None

# NameList Model Tests
def test_create_namelist(session):
    user = session.query(User).filter(User.username == "testuser2").first()
    namelist = NameList(name="testnamelist", names=["name1", "name2"], user_id=user.user_id)
    session.add(namelist)
    session.commit()
    session.refresh(namelist)
    assert namelist.namelist_id is not None
    assert namelist.name == "testnamelist"

def test_read_namelist(session):
    namelist = session.query(NameList).filter(NameList.name == "testnamelist").first()
    assert namelist is not None
    assert namelist.name == "testnamelist"

def test_update_namelist(session):
    namelist = session.query(NameList).filter(NameList.name == "testnamelist").first()
    namelist.names = ["name3", "name4"]
    session.commit()
    session.refresh(namelist)
    assert namelist.names == ["name3", "name4"]

def test_delete_namelist(session):
    namelist = session.query(NameList).filter(NameList.name == "testnamelist").first()
    session.delete(namelist)
    session.commit()
    namelist = session.query(NameList).filter(NameList.name == "testnamelist").first()
    assert namelist is None
