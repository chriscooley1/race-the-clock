import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, deleteCollection } from "../api";
import "../App.css";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../themeOptions";
import SessionSettingsModal from './SessionSettingsModal';

const YourCollections = () => {
  const [collections, setCollections] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [textColor, setTextColor] = useState("#000000");
  const { theme, setTheme } = useTheme();
  const userId = 1;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getCollections(userId);
      setCollections(data);
    };
    fetchCollections();
  }, [userId]);

  const handleDeleteCollection = async (collectionId) => {
    await deleteCollection(collectionId);
    setCollections(collections.filter(collection => collection.collection_id !== collectionId));
  };

  const handleStartCollection = (collectionId) => {
    const collection = collections.find(col => col.collection_id === collectionId);
    setSelectedCollection(collection);
    setShowModal(true);
  };

  const handleStartSession = (min, sec, shuffle) => {
    if (selectedCollection) {
      const sequenceItems = JSON.parse(selectedCollection.description || '[]');
      const sequence = sequenceItems.map(item => item.name);
      navigate("/fullscreen-display", {
        state: {
          sequence,
          speed,
          textColor,
          shuffle,
          theme: theme.className
        }
      });
      setShowModal(false);
    }
  };

  const handleThemeChange = (className) => {
    setTheme({ ...theme, className });
  };

  return (
    <div className="your-collections">
      <h2>Race The Clock</h2>
      <div className="collections-list">
        {collections.map(collection => (
          <div key={collection.collection_id} className="collection-item">
            <h1>{collection.name}</h1>
            <p>{JSON.parse(collection.description || '[]').length} items</p>
            <p>Created by you on {new Date(collection.created_at).toLocaleDateString()}</p>
            <button onClick={() => handleStartCollection(collection.collection_id)}>Start</button>
            <button onClick={() => handleDeleteCollection(collection.collection_id)}>Delete</button>
          </div>
        ))}
      </div>
      {showModal && selectedCollection && (
        <SessionSettingsModal
          collectionName={selectedCollection.name}
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
        />
      )}
    </div>
  );
};

export default YourCollections;
