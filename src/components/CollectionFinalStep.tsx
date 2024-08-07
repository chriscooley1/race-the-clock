import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { saveCollection } from "../api"; // Import API function

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, sequence } = location.state;
  const [items, setItems] = useState<{ id: number; name: string }[]>(
    sequence.map((name, index) => ({ id: index + 1, name }))
  ); // Initialize with sequence
  const [newItem, setNewItem] = useState<string>("");

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem(""); // Reset new item input field
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    try {
      // Construct a single API call with all the data
      const collectionData = items.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      await saveCollection(
        1, // Assume userId is 1 for example purposes, replace as needed
        collectionName,
        collectionData,
        isPublic ? "public" : "private"
      );
      navigate("/your-collections"); // Redirect to the collections page
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  return (
    <div className="collection-final-step-container">
      <h1>Collection: {collectionName}</h1>
      <h2>Step 3 - Fill Out Collection Body</h2>
      <p>To add another item to this Collection, click the add button below.</p>
      <div className="add-item-container">
        <input
          type="text"
          className="custom-input"
          placeholder="New Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button className="add-button" type="button" onClick={handleAddItem}>
          +
        </button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="item-container">
          <input
            type="text"
            className="item-input"
            value={item.name}
            readOnly // This makes the input read-only, remove if editing is required
          />
          <button
            className="remove-button"
            type="button"
            onClick={() => handleRemoveItem(item.id)}
          >
            x
          </button>
        </div>
      ))}
      <button
        className="save-button"
        type="button"
        onClick={handleSaveCollection}
      >
        Save Collection
      </button>
    </div>
  );
};

export default CollectionFinalStep;
