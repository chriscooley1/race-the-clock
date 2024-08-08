import React from "react";
import "../App.css"; // Ensure your CSS is properly set up to handle modal styling

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  items: string[]; // Assuming items are an array of strings for simplicity
  onSave: (items: string[]) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  items,
  onSave
}) => {
  const [editedItems, setEditedItems] = React.useState<string[]>(items);

  const handleSave = () => {
    onSave(editedItems);
    onClose(); // Close modal after save
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
          readOnly // Make this editable if you want users to change the name
        />
        <div className="item-list">
          {editedItems.map((item, index) => (
            <div key={index} className="item-container">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...editedItems];
                  newItems[index] = e.target.value;
                  setEditedItems(newItems);
                }}
                className="custom-input"
              />
              <button className="remove-button" onClick={() => {
                const newItems = editedItems.filter((_, i) => i !== index);
                setEditedItems(newItems);
              }}>Remove</button>
            </div>
          ))}
        </div>
        <button className="add-button" onClick={() => setEditedItems([...editedItems, ''])}>Add Item</button>
        <button className="save-button" onClick={handleSave}>Save Collection</button>
        <button className="cancel-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditCollectionModal;
