import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { saveCollection, getCurrentUser } from "../api";
import { periodicTable, PeriodicElement } from "../utils/periodicTable";
import { User } from "../types/user";
import { useTheme } from "../context/ThemeContext";
import { generateCountingSvg } from "../utils/RandomGenerators";

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
  const {
    collectionName,
    isPublic,
    category,
    sequence,
    type: initialType,
  } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<
    { id: number; name: string; svg?: string; count?: number }[]
  >(sequence.map((name, index) => ({ id: index + 1, name })));
  const [newItem, setNewItem] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { theme } = useTheme();

  interface Dot {
    position: string;
    color: string;
    shape: string;
  }

  const [dots, setDots] = useState<Dot[]>([{ position: "1", color: "blue", shape: "circle" }]);

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
      setNewItem(
        `${element.symbol} - ${element.name} - ${element.atomicNumber}`,
      );
      setSelectedElement(selectedValue);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem("");
    setSelectedElement("");
  };

  const handleAddDot = () => {
    setDots([...dots, { position: "1", color: "blue", shape: "circle" }]);
  };

  const handleRemoveDot = (index: number) => {
    setDots(dots.filter((_, i) => i !== index));
  };

  const handleDotChange = (index: number, field: keyof Dot, value: string) => {
    const newDots = [...dots];
    newDots[index][field] = value;
    setDots(newDots);
  };

  const handleAddNumberSenseItem = () => {
    const svgs = dots.map(dot => 
      generateCountingSvg(1, dot.color, dot.shape, dot.position)
    );
    const encodedSvg = encodeURIComponent(svgs.join(""));
    const newItem = {
      id: items.length + 1,
      name: `Number Sense: ${dots.length} dot(s)`,
      svg: encodedSvg,
      count: dots.length,
    };
    setItems([...items, newItem]);
    setDots([{ position: "1", color: "blue", shape: "circle" }]);
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
        description: JSON.stringify(items.map(item => ({
          name: item.name,
          svg: item.svg,
          count: item.count
        }))),
        status: isPublic ? "public" : "private",
        category: category,
        type: initialType || "default",
        items: items.map((item) => ({ 
          name: item.name,
          svg: item.svg,
          count: item.count
        })),
      };

      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData.items,
        collectionData.status,
        collectionData.category,
        collectionData.type,
        getAccessTokenSilently,
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
      <div
        className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[50px] ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
      <h1 className="text-4xl font-bold">Step 3 - Custom</h1>
      <h1 className="text-3xl font-bold">Collection: {collectionName}</h1>
      <p className="mb-4">
        To add another item to this Collection, click the add button below.
      </p>
      <div className="mb-4 flex flex-col items-center">
        {category === "Number Sense" ? (
          <>
            {dots.map((dot, index) => (
              <div key={index} className="mb-4 w-full">
                <h4 className="mb-2 text-lg font-bold">Dot {index + 1}</h4>
                <label htmlFor={`dot-position-${index}`} className="mb-2 block">
                  Select dot position:
                </label>
                <select
                  id={`dot-position-${index}`}
                  value={dot.position}
                  onChange={(e) => handleDotChange(index, "position", e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-black"
                >
                  {Array.from({ length: 25 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      Position {i + 1}
                    </option>
                  ))}
                </select>
                <label htmlFor={`dot-color-${index}`} className="mb-2 block">
                  Select dot color:
                </label>
                <select
                  id={`dot-color-${index}`}
                  value={dot.color}
                  onChange={(e) => handleDotChange(index, "color", e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-black"
                >
                  {["blue", "green", "red", "purple", "orange"].map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <label htmlFor={`dot-shape-${index}`} className="mb-2 block">
                  Select dot shape:
                </label>
                <select
                  id={`dot-shape-${index}`}
                  value={dot.shape}
                  onChange={(e) => handleDotChange(index, "shape", e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-black"
                >
                  {["circle", "square", "triangle"].map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </select>
                {dots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDot(index)}
                    className="mt-2 rounded-md bg-red-500 px-4 py-2 text-white"
                  >
                    Remove Dot
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDot}
              className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Add Another Dot
            </button>
            <button
              type="button"
              onClick={handleAddNumberSenseItem}
              className="flex size-10 items-center justify-center rounded-full bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
              title="Add Number Sense Item"
            >
              +
            </button>
          </>
        ) : category === "Science" ? (
          <>
            <label htmlFor="element-select" className="mb-2">
              Select an element:
            </label>
            <select
              id="element-select"
              value={selectedElement}
              onChange={handleElementSelect}
              className="mb-4 w-full rounded-md border border-gray-300 p-2 font-['Caveat']"
            >
              <option value="">Select an element</option>
              {Object.values(periodicTable).map((element) => (
                <option
                  key={element.atomicNumber}
                  value={JSON.stringify(element)}
                >
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
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat']"
              placeholder="Enter new item"
            />
          </>
        )}
        {category !== "Number Sense" && (
          <button
            type="button"
            onClick={handleAddItem}
            className="flex size-10 items-center justify-center rounded-full bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
            title="Add Item"
          >
            +
          </button>
        )}
      </div>
      {items.map((item) => (
        <div key={item.id} className="mb-2 flex items-center">
          {item.svg ? (
            <div className="mr-2 items-center">
              <img src={item.svg} alt={item.name} className="mr-2 size-12" />
              <span>{item.name}</span>
            </div>
          ) : (
            <input
              type="text"
              className="mr-2 grow rounded-md border border-gray-300 p-2 font-['Caveat']"
              value={item.name}
              readOnly
              title={`Item ${item.id}: ${item.name}`}
            />
          )}
          <button
            className="rounded-md bg-red-500 px-2 py-1 text-white transition duration-300 hover:bg-red-600"
            type="button"
            onClick={() => handleRemoveItem(item.id)}
            title="Remove Item"
          >
            x
          </button>
        </div>
      ))}
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
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
