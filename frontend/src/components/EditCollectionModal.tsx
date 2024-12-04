import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  items: { name: string; id?: number }[];
  onSave: (
    items: { name: string; id?: number }[],
    collectionName: string,
    isPublic: boolean,
  ) => void;
  type: string;
  isPublic: boolean;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  items,
  onSave,
  type, // Destructure type prop
  isPublic, // Destructure the new prop
}) => {
  const { theme } = useTheme();
  const [editedItems, setEditedItems] = useState<
    { name: string; id?: number }[]
  >([]);
  const [editedCollectionName, setEditedCollectionName] =
    useState(collectionName);
  const [isCollectionPublic, setIsCollectionPublic] = useState(isPublic); // State for checkbox
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processedItems = items.map((item) => ({
      name:
        typeof item.name === "object"
          ? JSON.stringify(item.name)
          : String(item.name),
      id: item.id,
    }));
    setEditedItems(processedItems);
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAddItem = () => {
    if (type === "Number Sense") {
      // Logic for adding a Number Sense item
      setEditedItems([{ name: "New Number Sense Item" }, ...editedItems]);
    } else if (type === "Periodic Table") {
      // Logic for adding a Periodic Table item
      setEditedItems([{ name: "New Periodic Table Item" }, ...editedItems]);
    } else {
      // Default logic for other types
      setEditedItems([{ name: "" }, ...editedItems]);
    }
  };

  const handleRemoveItem = (index: number) => {
    console.log("Removing item at index:", index);
    const newItems = editedItems.filter((_, i) => i !== index);
    setEditedItems(newItems);
  };

  const handleChangeItem = (index: number, value: string) => {
    console.log(`Changing item at index ${index} to ${value}`);
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], name: value };
    setEditedItems(newItems);
  };

  const handleSave = () => {
    console.log("Saving collection with items:", editedItems);
    console.log("New collection name:", editedCollectionName);
    onSave(editedItems, editedCollectionName, isCollectionPublic); // Pass the public status
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="flex max-h-[90vh] w-full max-w-md flex-col items-center overflow-y-auto rounded-lg p-4 shadow-lg"
        style={{
          backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
          color: theme.isDarkMode ? "#FFFFFF" : "#000000",
        }}
      >
        <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
          Edit Collection
        </h1>
        <div className="mb-4 flex flex-col items-center justify-center">
          <label htmlFor="collectionName" className="mb-2 block">
            Collection Name
          </label>
          <input
            type="text"
            id="collectionName"
            className="w-full rounded border border-black bg-white p-2 text-center text-black"
            value={editedCollectionName}
            onChange={(e) => setEditedCollectionName(e.target.value)}
            title="Collection Name"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isCollectionPublic} // Reflect current public status
              onChange={() => setIsCollectionPublic(!isCollectionPublic)} // Toggle public status
              className="mr-2"
            />
            Make Collection Public
          </label>
        </div>
        <div className="mb-4 flex flex-col items-center justify-center">
          <label className="mb-2 block"></label>
          <p className="flex justify-center">
            Click the add button to create a new item in the collection
          </p>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-black bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
            onClick={handleAddItem}
          >
            +
          </button>
        </div>
        <div>
          {editedItems.map((item, index) => (
            <div key={index} className="mb-4 flex items-center">
              <div className="mr-2 grow">
                <label htmlFor={`item-${index}`} className="mb-1 block">
                  Item {index + 1}
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id={`item-${index}`}
                    className="w-full rounded-lg border border-black bg-white p-2 text-center text-black"
                    value={item.name}
                    onChange={(e) => handleChangeItem(index, e.target.value)}
                    placeholder={`Enter item ${index + 1}`}
                    title={`Item ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="ml-8 flex size-[42px] items-center justify-center rounded-lg border border-black bg-red-500 text-2xl text-white transition duration-300 hover:bg-red-600"
                    onClick={() => handleRemoveItem(index)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex w-full justify-around">
          <button
            type="button"
            className="rounded border border-black bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
            onClick={handleSave}
          >
            Save Collection
          </button>
          <button
            type="button"
            className="rounded border border-black bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
