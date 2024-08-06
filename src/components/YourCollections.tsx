import React, { useState, useEffect } from "react";
import { getCollections, deleteCollection } from "../api";
import "../App.css";

// Define an interface for the Collection type
interface Collection {
  collection_id: number;
  name: string;
  description: string;
}

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
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

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
      setCollections(
        collections.filter(
          (collection) => collection.collection_id !== collectionId
        )
      );
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleStartCollection = (collectionId: number) => {
    // Add logic here to handle starting a collection
    console.log("Starting collection:", collectionId);
    // Navigate to the collection display or other functionality as needed
  };

  return (
    <div className="your-collections">
      <h2>Your Collections</h2>
      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.collection_id} className="collection-item">
            <h1>{collection.name}</h1>
            <p>{collection.description}</p>
            <button
              className="start-button"
              type="button"
              onClick={() => handleStartCollection(collection.collection_id)}
            >
              Start
            </button>
            <button
              className="delete-button"
              type="button"
              onClick={() => handleDeleteCollection(collection.collection_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCollections;
