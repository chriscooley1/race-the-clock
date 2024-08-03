import React, { useState, useEffect } from "react";
import { createCollection, getCollections, deleteCollection, updateCollection } from "../api";
import "../App.css";

interface Collection {
  collection_id: number;
  name: string;
  items: any[];  // Define more specific type based on your items structure
  createdBy: string;
  creationDate: Date;
}

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const userId = 1; // Replace with the actual user ID

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections(userId);
        setCollections(data.map(col => ({
          ...col,
          items: col.items || [], // Mock item data, replace or adjust as needed
          createdBy: "Username", // Mock username, replace with actual data
          creationDate: new Date() // Mock date, replace with actual data
        })));
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, [userId]);

  const handleCreateCollection = async () => {
    try {
      const newCollection = await createCollection(userId, "New Collection", "Description");
      setCollections([...collections, newCollection]);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
      setCollections(collections.filter(collection => collection.collection_id !== collectionId));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div className="your-collections">
      {collections.map((collection) => (
        <div key={collection.collection_id} className="collection-item">
          <h1>{collection.name}</h1>
          <h2>{collection.items.length} items in collection</h2>
          <p>Created by: {collection.createdBy}</p>
          <p className="creation-date">{collection.creationDate.toLocaleString()}</p>
          <button className="start-button">Start</button>
          <button type="button" onClick={() => handleDeleteCollection(collection.collection_id)}>Delete</button>
        </div>
      ))}
      <button type="button" onClick={handleCreateCollection}>Create New Collection</button>
    </div>
  );
};

export default YourCollections;
