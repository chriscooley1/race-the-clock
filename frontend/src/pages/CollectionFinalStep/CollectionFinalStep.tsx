import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionFinalStep.css";
import { saveCollection, getCurrentUser } from "../../api"; 
import "../../App.css"; 
import { useAuth0 } from "@auth0/auth0-react";

interface LocationState {
  collectionName: string;
  isPublic: boolean;
  category: string;
  sequence: string[]; 
}

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category, sequence } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0(); 
  const [items, setItems] = useState<{ id: number; name: string }[]>(sequence.map((name, index) => ({ id: index + 1, name })));
  const [newItem, setNewItem] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        console.log("Fetched user:", fetchedUser);
        setCurrentUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    console.log("User data in state:", currentUser);
  }, [currentUser]);

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem(""); 
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    console.log("User data before saving collection:", currentUser);

    try {
      if (!currentUser || !currentUser.username) {
        throw new Error("Current user is undefined");
      }

      const collectionData = category === "Math Problems"
        ? items.map((item) => ({
            id: item.id,
            name: item.name,
            problem: item.name,
            answer: calculateAnswer(item.name),
          }))
        : items.map((item) => ({
            id: item.id,
            name: item.name,
          }));

      console.log("Saving collection with data:", {
        username: currentUser.username,
        collectionName,
        collectionData,
        isPublic,
        category,
      });
      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        getAccessTokenSilently
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  const calculateAnswer = (problem: string): number => {
    const [num1, operator, num2] = problem.split(' ');
    switch (operator) {
      case "+": return parseInt(num1) + parseInt(num2);
      case "-": return parseInt(num1) - parseInt(num2);
      case "×": return parseInt(num1) * parseInt(num2);
      case "÷": return parseFloat((parseInt(num1) / parseInt(num2)).toFixed(2));
      default: return 0;
    }
  };

  if (!currentUser) {
    return <div>Loading user information...</div>; 
  }

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
            readOnly 
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
