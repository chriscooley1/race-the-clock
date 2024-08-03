import React, { useState, useEffect } from "react";
import { getCollections, deleteCollection, createCollection } from "../api";
import "../App.css";
import useDebounce from "../useDebounce"; // Make sure this path matches where your useDebounce file is located

interface Collection {
  collection_id: number;
  name: string;
  items: any[];  // Ensure this aligns with your data structure
  createdBy: string;
  creationDate: Date;
}

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const userId = 1;  // Replace with actual user ID or retrieve from context/store

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
      setCollections(prevCollections => prevCollections.filter(collection => collection.collection_id !== collectionId));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div className="your-collections">
      {collections.map((collection) => (
        <div key={collection.collection_id} className="collection-item">
          <h1>{collection.name}</h1>
          <h2>{collection.items?.length ?? 0} items in collection</h2>
          <p>Created by: {collection.createdBy}</p>
          <p className="creation-date">
            {collection.creationDate ? new Date(collection.creationDate).toLocaleString() : 'No date provided'}
          </p>
          <button className="start-button">Start</button>
          <button type="button" onClick={() => handleDeleteCollection(collection.collection_id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default YourCollections;
