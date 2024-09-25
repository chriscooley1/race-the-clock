import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionFinalStep.css";
import { saveCollection, getCurrentUser } from "../../api"; 
import "../../App.css"; 
import { useAuth0 } from "@auth0/auth0-react";
import { periodicTable, PeriodicElement } from "../../utils/periodicTable";

// Define the generateId function
function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface LocationState {
  collectionName: string;
  isPublic: boolean;
  category: string;
  sequence: string[];
  type?: string; // Add this line
}

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category, sequence, type: initialType } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0(); 
  const [items, setItems] = useState<{ id: number; name: string }[]>(sequence.map((name, index) => ({ id: index + 1, name })));
  const [newItem, setNewItem] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<string>("");
  interface User {
    id: string;
    name: string;
    username: string;
  }
  const [currentUser, setCurrentUser] = useState<User | null>(null); 

  const handleElementSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const element = JSON.parse(selectedValue) as PeriodicElement;
      setNewItem(`${element.symbol} - ${element.name} - ${element.atomicNumber}`);
      setSelectedElement(selectedValue);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        console.log("Fetched user:", fetchedUser);
        const userWithId: User = { 
          ...fetchedUser, 
          id: fetchedUser.id || generateId(),
          name: fetchedUser.name || "",
          username: fetchedUser.username || "defaultUsername" // Ensure "username" is present
        };
        setCurrentUser(userWithId);
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
    setSelectedElement("");
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

      const collectionData = items.map((item) => ({
        id: item.id,
        name: item.name,
      }));

      let type = initialType || "default";
      if (!initialType) {
        // Determine type based on category if not provided
        if (category === "Math") {
          type = "numbers"; // or "mathProblems" if appropriate
        } else if (category === "Language Arts") {
          type = "letters";
        } // ... and so on
      }

      console.log("Saving collection with data:", {
        username: currentUser.username,
        collectionName,
        collectionData,
        isPublic,
        category,
        type,
      });
      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        type, // Add this parameter
        getAccessTokenSilently
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddItem();
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
        {category === "Science" ? (
          <>
            <label htmlFor="element-select">Select an element:</label>
            <select
              id="element-select"
              value={selectedElement}
              onChange={handleElementSelect}
              className="final-custom-input"
            >
              <option value="">Select an element</option>
              {Object.values(periodicTable).map((element) => (
                <option key={element.atomicNumber} value={JSON.stringify(element)}>
                  {element.symbol} - {element.name} - {element.atomicNumber}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
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
              onKeyDown={handleKeyDown}
            />
          </>
        )}
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
