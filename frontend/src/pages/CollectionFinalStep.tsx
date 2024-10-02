import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { saveCollection, getCurrentUser } from "../api";
import { periodicTable, PeriodicElement } from "../utils/periodicTable";
import { User } from "../types/user";

// Export the function to avoid the "unused" error
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface LocationState {
  collectionName: string;
  isPublic: boolean;
  category: string;
  sequence: string[];
  type?: string;
}

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category, sequence, type: initialType } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<{ id: number; name: string }[]>(sequence.map((name, index) => ({ id: index + 1, name })));
  const [newItem, setNewItem] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        setCurrentUser(fetchedUser as User); // Add type assertion here
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);

  const handleElementSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const element = JSON.parse(selectedValue) as PeriodicElement;
      setNewItem(`${element.symbol} - ${element.name} - ${element.atomicNumber}`);
      setSelectedElement(selectedValue);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem("");
    setSelectedElement("");
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    if (!currentUser) {
      console.error("Current user is not set");
      return;
    }

    try {
      const collectionData = {
        name: collectionName,
        description: "Collection description", // Add a description or use a state variable
        status: isPublic ? "public" : "private",
        category: category,
        type: initialType || "default",
        items: items.map(item => ({ name: item.name })) // Convert to object array
      };

      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData.items,
        collectionData.status,
        collectionData.category,
        collectionData.type,
        getAccessTokenSilently
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  if (!currentUser) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Collection: {collectionName}</h1>
      <h2 className="text-xl mb-2">Step 3 - Fill Out Collection Body</h2>
      <p className="mb-4">To add another item to this Collection, click the add button below.</p>
      <div className="w-full flex flex-col items-center mb-4">
        {category === "Science" ? (
          <>
            <label htmlFor="element-select" className="mb-2">Select an element:</label>
            <select
              id="element-select"
              value={selectedElement}
              onChange={handleElementSelect}
              className="w-full p-2 border border-gray-300 rounded-md font-['Caveat'] mb-4"
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
            <label htmlFor="new-item-input" className="sr-only">New Item</label>
            <input
              type="text"
              id="new-item-input"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md font-['Caveat'] mb-2"
              placeholder="Enter new item"
            />
          </>
        )}
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-green-500 text-white rounded-full size-10 flex items-center justify-center text-2xl hover:bg-green-600 transition duration-300"
          title="Add Item"
        >
          +
        </button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex items-center w-full mb-2">
          <input
            type="text"
            className="grow p-2 border border-gray-300 rounded-md font-['Caveat'] mr-2"
            value={item.name}
            readOnly
            title={`Item ${item.id}: ${item.name}`}
          />
          <button
            className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 transition duration-300"
            type="button"
            onClick={() => handleRemoveItem(item.id)}
            title="Remove Item"
          >
            x
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-4"
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
