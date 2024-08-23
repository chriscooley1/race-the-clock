import React, { useState } from "react";
import "./EditCollectionModal.css";
import "../../App.css"; // Global styles for the app

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  items: string[]; // Assuming items are an array of strings
  onSave: (items: string[]) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  items,
  onSave,
}) => {
  const [editedItems, setEditedItems] = useState<string[]>(items);

  const handleAddItem = () => {
    setEditedItems(["", ...editedItems]);
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

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).className === "edit-modal-background") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-background" onClick={handleBackgroundClick}>
      <div className="edit-modal-container">
        <h1>Edit Collection</h1>
        <div className="input-group">
          <label htmlFor="collectionName">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            className="edit-custom-input"
            value={collectionName}
            readOnly
            title="Collection Name"
          />
        </div>
        <div className="input-group">
          <label>Collection Body</label>
          <p>Click the add button to create a new item in the collection</p>
          <button
            type="button"
            className="edit-add-button"
            onClick={handleAddItem}
          >
            +
          </button>
        </div>
        <div className="edit-item-list">
          {editedItems.map((item, index) => (
            <div key={index} className="edit-item-container">
              <div className="input-group edit-item-input-group">
                <label htmlFor={`item-${index}`}>Item {index + 1}</label>
                <input
                  type="text"
                  id={`item-${index}`}
                  className="edit-custom-input edit-item-input"
                  value={item}
                  onChange={(e) => handleChangeItem(index, e.target.value)}
                  placeholder={`Enter item ${index + 1}`}
                  title={`Item ${index + 1}`}
                />
              </div>
              <button
                type="button"
                className="edit-remove-button"
                onClick={() => handleRemoveItem(index)}
              >
                <span className="edit-remove-icon">&times;</span>
              </button>
            </div>
          ))}
        </div>
        <div className="edit-button-group">
          <button type="button" className="edit-save-button" onClick={handleSave}>
            Save Collection
          </button>
          <button type="button" className="edit-cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
