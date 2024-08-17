import React, { useState } from "react";
import "./EditCollectionModal.css";

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

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).className === "modal-background") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-container">
        <h1>Edit Collection</h1>
        <div className="input-group">
          <label htmlFor="collectionName">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            className="custom-input"
            value={collectionName}
            readOnly
            title="Collection Name"
          />
        </div>
        <div className="item-list">
          {editedItems.map((item, index) => (
            <div key={index} className="item-container">
              <div className="input-group">
                <label htmlFor={`item-${index}`}>Item {index + 1}</label>
                <input
                  type="text"
                  id={`item-${index}`}
                  className="custom-input"
                  value={item}
                  onChange={(e) => handleChangeItem(index, e.target.value)}
                  placeholder={`Enter item ${index + 1}`}
                  title={`Item ${index + 1}`}
                />
              </div>
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddItem}>
            +
          </button>
          <button type="button" className="save-button" onClick={handleSave}>
            Save Collection
          </button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
