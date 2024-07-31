import React, { useState, useEffect } from "react";
import { createCollection, getCollections, deleteCollection, updateCollection } from "../api";
import "../App.css";

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const userId = 1; // Replace with the actual user ID

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getCollections(userId);
      setCollections(data);
    };
    fetchCollections();
  }, []);

  const handleCreateCollection = async () => {
    const newCollection = await createCollection(userId, newCollectionName, newCollectionDescription);
    setCollections([...collections, newCollection]);
  };

  const handleDeleteCollection = async (collectionId: number) => {
    await deleteCollection(collectionId);
    setCollections(collections.filter((collection) => collection.collection_id !== collectionId));
  };

  const handleUpdateCollection = async (collectionId: number) => {
    const updatedCollection = await updateCollection(collectionId, newCollectionName, newCollectionDescription);
    setCollections(collections.map((collection) => (collection.collection_id === collectionId ? updatedCollection : collection)));
  };

  return (
    <div className="your-collections">
      <h2>Your Collections</h2>
      <div>
        <input
          type="text"
          placeholder="Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Collection Description"
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
        />
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>
      <div>
        {collections.map((collection) => (
          <div key={collection.collection_id}>
            <h3>{collection.name}</h3>
            <p>{collection.description}</p>
            <button onClick={() => handleUpdateCollection(collection.collection_id)}>Update</button>
            <button onClick={() => handleDeleteCollection(collection.collection_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCollections;
