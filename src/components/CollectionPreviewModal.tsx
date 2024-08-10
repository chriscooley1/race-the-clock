import React from "react";

interface ModalProps {
  collection: {
    name: string;
    description: string;
    items: { name: string }[];
  };
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<ModalProps> = ({ collection, onClose }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <h1>{collection.name}</h1>
        <p>{collection.description}</p>
        {collection.items.length > 0 ? (
          <ul>
            {collection.items.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No items available in this collection.</p>
        )}
        <button type="button" onClick={onClose}>Close Preview</button>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
