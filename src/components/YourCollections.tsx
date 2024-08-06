import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, deleteCollection } from "../api";
import "../App.css";

// Define an interface for the Collection type
interface Collection {
  collection_id: number;
  name: string;
  description: string; // JSON string of items
}

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const userId = 1; // Replace with the actual user ID
  const navigate = useNavigate();

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
    const collection = collections.find(
      (col) => col.collection_id === collectionId
    );
    if (collection) {
      // Ensure the sequence is an array of strings
      const sequenceItems = JSON.parse(collection.description);
      const sequence = sequenceItems.map((item: { name: string }) => item.name);

      // Navigate to a fullscreen display with the sequence
      navigate("/fullscreen-display", { state: { sequence, speed: 500 } }); // Adjust speed as needed
    }
  };

  return (
    <div className="your-collections">
      <h2>Your Collections</h2>
      <div className="collections-list">
        {collections.map((collection) => {
          // Calculate the item count
          const itemCount = JSON.parse(collection.description).length;
          return (
            <div key={collection.collection_id} className="collection-item">
              <h1>{collection.name}</h1>
              <p>{itemCount} item in the collection</p>
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
          );
        })}
      </div>
    </div>
  );
};

export default YourCollections;
