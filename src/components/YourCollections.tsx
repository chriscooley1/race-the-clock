import React, { useState, useEffect } from "react";
import { createCollection, getCollections, deleteCollection, updateCollection } from "../api";
import "../App.css";
// Define an interface for the Collection type
interface Collection {
  collection_id: number;
  name: string;
  description: string;
}
const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [newCollectionDescription, setNewCollectionDescription] = useState<string>("");
  const userId = 1; // Replace with the actual user ID
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections(userId);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, [userId]);
  const handleCreateCollection = async () => {
    try {
      const newCollection = await createCollection(userId, newCollectionName, newCollectionDescription);
      setCollections([...collections, newCollection]);
      setNewCollectionName("");
      setNewCollectionDescription("");
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };
  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
      setCollections(collections.filter((collection) => collection.collection_id !== collectionId));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };
  const handleUpdateCollection = async (collectionId: number) => {
    try {
      const updatedCollection = await updateCollection(collectionId, newCollectionName, newCollectionDescription);
      setCollections(collections.map((collection) => (collection.collection_id === collectionId ? updatedCollection : collection)));
      setSelectedCollectionId(null);
      setNewCollectionName("");
      setNewCollectionDescription("");
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };
  const handleEditCollection = (collection: Collection) => {
    setSelectedCollectionId(collection.collection_id);
    setNewCollectionName(collection.name);
    setNewCollectionDescription(collection.description);
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
        {selectedCollectionId ? (
          <button type="button" onClick={() => handleUpdateCollection(selectedCollectionId)}>Update Collection</button>
        ) : (
          <button type="button" onClick={handleCreateCollection}>Create Collection</button>
        )}
      </div>
      <div>
        {collections.map((collection) => (
          <div key={collection.collection_id}>
            <h3>{collection.name}</h3>
            <p>{collection.description}</p>
            <button type="button" onClick={() => handleEditCollection(collection)}>Edit</button>
            <button type="button" onClick={() => handleDeleteCollection(collection.collection_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCollections;
