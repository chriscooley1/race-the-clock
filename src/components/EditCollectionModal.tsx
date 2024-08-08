import React, { useState } from "react";
import "../App.css";

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  items: string[];  // Assuming items are an array of strings
  onSave: (items: string[]) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  items,
  onSave
}) => {
  const [editedItems, setEditedItems] = useState<string[]>(items);

  const handleAddItem = () => {
    setEditedItems([...editedItems, ""]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = editedItems.filter((_, i) => i !== index);
    setEditedItems(newItems);
  };

  const handleChangeItem = (index: number, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  const handleSave = () => {
    onSave(editedItems);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h1>Edit Collection</h1>
        <input
          type="text"
          className="custom-input"
          value={collectionName}
          readOnly
        />
        <div className="item-list">
          {editedItems.map((item, index) => (
            <div key={index} className="item-container">
              <input
                type="text"
                className="custom-input"
                value={item}
                onChange={(e) => handleChangeItem(index, e.target.value)}
              />
              <button type="button" className="remove-button" onClick={() => handleRemoveItem(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddItem}>Add Item</button>
          <button type="button" className="save-button" onClick={handleSave}>Save Collection</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
