import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, deleteCollection } from "../api";
import "../App.css";
import { useTheme } from "../context/ThemeContext";
import SessionSettingsModal from "./SessionSettingsModal";

const YourCollections = () => {
  const [collections, setCollections] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [textColor, setTextColor] = useState("#000000");
  const { theme } = useTheme();
  const userId = 1; // Replace with the actual user ID
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

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

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteCollection(collectionId);
      setCollections(collections.filter((collection) => collection.collection_id !== collectionId));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleStartCollection = (collectionId) => {
    const collection = collections.find((col) => col.collection_id === collectionId);
    if (collection) {
      setSelectedCollection(collection);
      setShowModal(true);
    }
  };

  const handleStartSession = (min, sec, shuffle, speed, textColor, themeClassName) => {
    if (selectedCollection) {
      const sequenceItems = JSON.parse(selectedCollection.description || "[]");
      const sequence = sequenceItems.map((item) => item.name);
      const duration = min * 60 + sec; // Convert minutes and seconds to total seconds
      navigate("/fullscreen-display", {
        state: {
          sequence,
          duration,
          speed,
          textColor,
          shuffle,
          theme: themeClassName,
        },
      });
      setShowModal(false);
    }
  };

  return (
    <div className="your-collections">
      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.collection_id} className="collection-item">
            <h1>{collection.name}</h1>
            <p>{JSON.parse(collection.description || "[]").length} items</p>
            <p>Created by you on {new Date(collection.created_at).toLocaleDateString()}</p>
            <button
              type="button"
              className="start-button"
              onClick={() => handleStartCollection(collection.collection_id)}
            >
              Start
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={() => handleDeleteCollection(collection.collection_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {showModal && selectedCollection && (
        <SessionSettingsModal
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
          currentSettings={{
            speed: speed,
            theme: theme,
            textColor: textColor,
          }}
        />
      )}
    </div>
  );
};

export default YourCollections;
