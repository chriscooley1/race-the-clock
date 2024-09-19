import os
import sys
import pytest
from sqlmodel import SQLModel, Session, create_engine, select
from models import User, Sequence, Collection, Item, NameList

# Set up testing environment
os.environ["TESTING"] = "True"

@pytest.fixture(scope="function")
def engine():
    return create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})

@pytest.fixture(scope="function")
def session(engine):
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

# User Model Tests
def test_create_user(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.user_id is not None
    assert user.username == "testuser"

def test_read_user(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    db_user = session.exec(select(User).where(User.username == "testuser")).first()
    assert db_user is not None
    assert db_user.username == "testuser"

def test_update_user(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    db_user = session.exec(select(User).where(User.username == "testuser")).first()
    db_user.email = "newemail@example.com"
    session.commit()
    session.refresh(db_user)
    assert db_user.email == "newemail@example.com"

def test_delete_user(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    db_user = session.exec(select(User).where(User.username == "testuser")).first()
    session.delete(db_user)
    session.commit()
    deleted_user = session.exec(select(User).where(User.username == "testuser")).first()
    assert deleted_user is None

# Sequence Model Tests
def test_create_sequence(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    sequence = Sequence(name="testsequence", description="A test sequence", user_id=user.user_id)
    session.add(sequence)
    session.commit()
    session.refresh(sequence)
    assert sequence.sequence_id is not None
    assert sequence.name == "testsequence"

def test_read_sequence(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    sequence = Sequence(name="testsequence", description="A test sequence", user_id=user.user_id)
    session.add(sequence)
    session.commit()
    
    db_sequence = session.exec(select(Sequence).where(Sequence.name == "testsequence")).first()
    assert db_sequence is not None
    assert db_sequence.name == "testsequence"

def test_update_sequence(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    sequence = Sequence(name="testsequence", description="A test sequence", user_id=user.user_id)
    session.add(sequence)
    session.commit()
    
    db_sequence = session.exec(select(Sequence).where(Sequence.name == "testsequence")).first()
    db_sequence.description = "Updated description"
    session.commit()
    session.refresh(db_sequence)
    assert db_sequence.description == "Updated description"

def test_delete_sequence(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    sequence = Sequence(name="testsequence", description="A test sequence", user_id=user.user_id)
    session.add(sequence)
    session.commit()
    
    db_sequence = session.exec(select(Sequence).where(Sequence.name == "testsequence")).first()
    session.delete(db_sequence)
    session.commit()
    deleted_sequence = session.exec(select(Sequence).where(Sequence.name == "testsequence")).first()
    assert deleted_sequence is None

# Collection Model Tests
def test_create_collection(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    session.refresh(collection)
    assert collection.collection_id is not None
    assert collection.name == "testcollection"

def test_read_collection(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    db_collection = session.exec(select(Collection).where(Collection.name == "testcollection")).first()
    assert db_collection is not None
    assert db_collection.name == "testcollection"

def test_update_collection(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    db_collection = session.exec(select(Collection).where(Collection.name == "testcollection")).first()
    db_collection.description = "Updated description"
    session.commit()
    session.refresh(db_collection)
    assert db_collection.description == "Updated description"

def test_delete_collection(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    db_collection = session.exec(select(Collection).where(Collection.name == "testcollection")).first()
    session.delete(db_collection)
    session.commit()
    deleted_collection = session.exec(select(Collection).where(Collection.name == "testcollection")).first()
    assert deleted_collection is None

# Item Model Tests
def test_create_item(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    item = Item(name="testitem", collection_id=collection.collection_id)
    session.add(item)
    session.commit()
    session.refresh(item)
    assert item.item_id is not None
    assert item.name == "testitem"

def test_read_item(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    item = Item(name="testitem", collection_id=collection.collection_id)
    session.add(item)
    session.commit()
    
    db_item = session.exec(select(Item).where(Item.name == "testitem")).first()
    assert db_item is not None
    assert db_item.name == "testitem"

def test_update_item(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    item = Item(name="testitem", collection_id=collection.collection_id)
    session.add(item)
    session.commit()
    
    db_item = session.exec(select(Item).where(Item.name == "testitem")).first()
    db_item.name = "updateditem"
    session.commit()
    session.refresh(db_item)
    assert db_item.name == "updateditem"

def test_delete_item(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    collection = Collection(name="testcollection", description="A test collection", category="test", user_id=user.user_id)
    session.add(collection)
    session.commit()
    
    item = Item(name="testitem", collection_id=collection.collection_id)
    session.add(item)
    session.commit()
    
    db_item = session.exec(select(Item).where(Item.name == "testitem")).first()
    session.delete(db_item)
    session.commit()
    deleted_item = session.exec(select(Item).where(Item.name == "testitem")).first()
    assert deleted_item is None

# NameList Model Tests
def test_create_namelist(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    namelist = NameList(name="testnamelist", names=["name1", "name2"], user_id=user.user_id)
    session.add(namelist)
    session.commit()
    session.refresh(namelist)
    assert namelist.namelist_id is not None
    assert namelist.name == "testnamelist"

def test_read_namelist(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    namelist = NameList(name="testnamelist", names=["name1", "name2"], user_id=user.user_id)
    session.add(namelist)
    session.commit()
    
    db_namelist = session.exec(select(NameList).where(NameList.name == "testnamelist")).first()
    assert db_namelist is not None
    assert db_namelist.name == "testnamelist"

def test_update_namelist(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    namelist = NameList(name="testnamelist", names=["name1", "name2"], user_id=user.user_id)
    session.add(namelist)
    session.commit()
    
    db_namelist = session.exec(select(NameList).where(NameList.name == "testnamelist")).first()
    db_namelist.names = ["name3", "name4"]
    session.commit()
    session.refresh(db_namelist)
    assert db_namelist.names == ["name3", "name4"]

def test_delete_namelist(session):
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    
    namelist = NameList(name="testnamelist", names=["name1", "name2"], user_id=user.user_id)
    session.add(namelist)
    session.commit()
    
    db_namelist = session.exec(select(NameList).where(NameList.name == "testnamelist")).first()
    session.delete(db_namelist)
    session.commit()
    deleted_namelist = session.exec(select(NameList).where(NameList.name == "testnamelist")).first()
    assert deleted_namelist is None
