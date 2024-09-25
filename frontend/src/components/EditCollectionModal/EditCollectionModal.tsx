import React, { useState, useEffect } from "react";
import "./EditCollectionModal.css";
import "../../App.css";

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

  useEffect(() => {
    // Process items when the modal opens
    const processedItems = items.map(item => ({
      name: typeof item.name === "object" ? JSON.stringify(item.name) : String(item.name),
      id: item.id
    }));
    setEditedItems(processedItems);
  }, [items]);

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
    onClose(); // Close the modal after saving
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).className === "edit-modal-background") {
      console.log("Clicked on background, closing modal...");
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
                  value={item.name}
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
