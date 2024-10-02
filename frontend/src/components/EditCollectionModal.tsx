import React, { useState, useEffect, useRef } from "react";

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  items: { name: string; id?: number }[];
  onSave: (items: { name: string; id?: number }[]) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  items,
  onSave,
}) => {
  const [editedItems, setEditedItems] = useState<{ name: string; id?: number }[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processedItems = items.map(item => ({
      name: typeof item.name === "object" ? JSON.stringify(item.name) : String(item.name),
      id: item.id
    }));
    setEditedItems(processedItems);
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
    console.log("Adding new item...");
    setEditedItems([{ name: "" }, ...editedItems]);
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
    onSave(editedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl text-white shadow-lg flex flex-col items-center overflow-y-auto max-h-[90vh]">
        <h1 className="text-2xl font-bold mb-6">Edit Collection</h1>
        <div className="w-full mb-4">
          <label htmlFor="collectionName" className="block mb-2">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            className="w-full p-2 bg-white text-black border border-gray-300 rounded"
            value={collectionName}
            readOnly
            title="Collection Name"
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-2">Collection Body</label>
          <p className="mb-2">Click the add button to create a new item in the collection</p>
          <button
            type="button"
            className="bg-green-500 text-white rounded-full size-10 flex items-center justify-center text-2xl hover:bg-green-600 transition duration-300"
            onClick={handleAddItem}
          >
            +
          </button>
        </div>
        <div className="w-full">
          {editedItems.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <div className="grow mr-2">
                <label htmlFor={`item-${index}`} className="block mb-1">Item {index + 1}</label>
                <input
                  type="text"
                  id={`item-${index}`}
                  className="w-full p-2 bg-white text-black border border-gray-300 rounded"
                  value={item.name}
                  onChange={(e) => handleChangeItem(index, e.target.value)}
                  placeholder={`Enter item ${index + 1}`}
                  title={`Item ${index + 1}`}
                />
              </div>
              <button
                type="button"
                className="bg-red-500 text-white rounded size-10 flex items-center justify-center hover:bg-red-600 transition duration-300"
                onClick={() => handleRemoveItem(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full mt-6">
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300" onClick={handleSave}>
            Save Collection
          </button>
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
