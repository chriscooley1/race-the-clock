import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionFinalStep.css";
import { saveCollection } from "../../api"; // Import API function
import "../../App.css"; // Global styles for the app
import { useAuth0 } from "@auth0/auth0-react";

interface LocationState {
  collectionName: string;
  isPublic: boolean;
  category: string;
  sequence: string[]; // Assuming sequence is an array of strings
}

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category, sequence } = location.state as LocationState; // Cast location.state to LocationState
  const { getAccessTokenSilently } = useAuth0(); // Import the function from Auth0

  const [items, setItems] = useState<{ id: number; name: string }[]>(
    sequence.map((name: string, index: number) => ({ id: index + 1, name })) // Explicitly define type of name
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
      const token = await getAccessTokenSilently(); // Retrieve the access token
      const collectionData = items.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      await saveCollection(
        "1", // Replace with actual userId, or get it from Auth0
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        getAccessTokenSilently // Pass the function itself
      );      
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
        <label htmlFor="new-item-input" className="sr-only">
          New Item
        </label>
        <input
          type="text"
          id="new-item-input"
          className="custom-input"
          placeholder="New Item"
          title="Enter a new item to add to the collection"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className="add-button"
          type="button"
          onClick={handleAddItem}
          title="Add Item"
        >
          +
        </button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="item-container">
          <label htmlFor={`item-input-${item.id}`} className="sr-only">
            Item {item.id}
          </label>
          <input
            type="text"
            id={`item-input-${item.id}`}
            className="item-input"
            value={item.name}
            readOnly // This makes the input read-only, remove if editing is required
            title={`Item ${item.id}: ${item.name}`}
          />
          <button
            className="remove-button"
            type="button"
            onClick={() => handleRemoveItem(item.id)}
            title="Remove Item"
          >
            x
          </button>
        </div>
      ))}
      <button
        className="save-button"
        type="button"
        onClick={handleSaveCollection}
        title="Save Collection"
      >
        Save Collection
      </button>
    </div>
  );
};

export default CollectionFinalStep;