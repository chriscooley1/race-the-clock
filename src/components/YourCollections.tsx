import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, deleteCollection } from "../api";
import "../App.css";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../themeOptions";

// Define an interface for the Collection type
interface Collection {
  collection_id: number;
  name: string;
  description: string;
  creator_username: string;
  created_at: string; // Ensure this field is included
}

const YourCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [speed, setSpeed] = useState<number>(500);
  const [textColor, setTextColor] = useState<string>("#000000");
  const { theme, setTheme } = useTheme();
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
      const sequenceItems = JSON.parse(collection.description);
      const sequence = sequenceItems.map((item: { name: string }) => item.name);

      navigate("/fullscreen-display", {
        state: {
          sequence,
          speed,
          textColor,
          theme: theme.className, // Pass the theme to FullScreenDisplay
        },
      });
    }
  };

  const handleThemeChange = (className: string) => {
    setTheme({ ...theme, className }); // Ensure this updates the theme
  };

  return (
    <div className="your-collections">
      <h2 style={{ color: "black" }}>Your Collections</h2>

      <div className="customization-options">
        <div className="input-field">
          <label htmlFor="speedInput" style={{ color: "black" }}>Speed: </label>
          <select
            id="speedInput"
            className="custom-input"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value={250}>0.25 seconds</option>
            <option value={500}>0.5 seconds</option>
            <option value={750}>0.75 seconds</option>
            <option value={1000}>1 second</option>
            <option value={1500}>1.5 seconds</option>
            <option value={2000}>2 seconds</option>
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="textColorInput" style={{ color: "black" }}>Text Color: </label>
          <select
            id="textColorInput"
            className="custom-input"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          >
            {textColorOptions.map((color, index) => (
              <option key={index} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="themeSelect" style={{ color: "black" }}>Select Theme: </label>
          <select
            id="themeSelect"
            className="custom-input"
            value={theme.className}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            {themes.map((theme, index) => (
              <option key={index} value={theme.className}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="collections-list">
        {collections.map((collection) => {
          const itemCount = JSON.parse(collection.description).length;
          const formattedDate = new Date(collection.created_at).toLocaleDateString();

          return (
            <div key={collection.collection_id} className="collection-item">
              <h1>{collection.name}</h1>
              <p>{itemCount} items in the collection</p>
              <p>
                Created by you on {formattedDate}
              </p>
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
