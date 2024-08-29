import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionFinalStep.css";
import { saveCollection, getCurrentUser } from "../../api"; // Import API functions
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
  const { collectionName, isPublic, category, sequence } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0(); // Import the function from Auth0
  const [items, setItems] = useState<{ id: number; name: string }[]>(
    sequence.map((name: string, index: number) => ({ id: index + 1, name })) // Explicitly define type of name
  );
  const [newItem, setNewItem] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null); // State to hold current user data

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        setCurrentUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem(""); // Reset new item input field
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    try {
      if (!currentUser || !currentUser.username) {
        throw new Error("Current user is undefined");
      }

      const collectionData = items.map((item) => ({
        id: item.id,
        name: item.name,
      }));

      await saveCollection(
        currentUser.username, // Use the current user's username from the backend
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
          className="final-custom-input"
          placeholder="New Item"
          title="Enter a new item to add to the collection"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className="final-add-button"
          type="button"
          onClick={handleAddItem}
          title="Add Item"
        >
          +
        </button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="final-item-container">
          <label htmlFor={`item-input-${item.id}`} className="sr-only">
            Item {item.id}
          </label>
          <input
            type="text"
            id={`item-input-${item.id}`}
            className="final-item-input"
            value={item.name}
            readOnly // This makes the input read-only, remove if editing is required
            title={`Item ${item.id}: ${item.name}`}
          />
          <button
            className="final-remove-button"
            type="button"
            onClick={() => handleRemoveItem(item.id)}
            title="Remove Item"
          >
            x
          </button>
        </div>
      ))}
      <button
        className="final-save-button"
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
