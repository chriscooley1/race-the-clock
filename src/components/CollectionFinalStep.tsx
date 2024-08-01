import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { saveCollection } from "../api"; // Assume this is your API call to save the collection

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName } = location.state;
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
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
      // Replace 1 with the actual userId
      await saveCollection(1, collectionName, items);
      navigate("/your-collections");
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
        <button className="add-button" type="button" onClick={handleAddItem}>
          +
        </button>
        <span>New Item</span>
        <input
          type="text"
          placeholder="New Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        {items.map((item) => (
          <div key={item.id} className="item-container">
            <span>{item.name}</span>
            <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>
              x
            </button>
          </div>
        ))}
      </div>
      <button className="save-button" type="button" onClick={handleSaveCollection}>
        Save Collection
      </button>
    </div>
  );
};

export default CollectionFinalStep;