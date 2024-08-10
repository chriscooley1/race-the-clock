import React from "react";

interface ModalProps {
  collection: {
    name: string;
    description: string;
    items: string[]; // Assuming you're sending a list of items, adjust as needed
  };
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<ModalProps> = ({ collection, onClose }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <h1>{collection.name}</h1>
        <p>{collection.description}</p>
        <ul>
          {collection.items && collection.items.length > 0 ? (
            collection.items.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <p>No items in this collection.</p>
          )}
        </ul>
        <button type="button" onClick={onClose}>Close Preview</button>
      </div>
    </div>
  );
};


export default CollectionPreviewModal;
