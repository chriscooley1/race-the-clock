import React from "react";
import "./CollectionPreviewModal.css";
import "../../App.css"; // Global styles for the app

interface ModalProps {
  collection: {
    name: string;
    items: { name: string }[];
  };
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<ModalProps> = ({ collection, onClose }) => {
  return (
    <div className="modal-background" onClick={(e) => {
        if ((e.target as HTMLElement).className === "modal-background") {
          onClose();
        }
      }}>
      <div className="modal-container">
        <h1>{collection.name}</h1>
        <div className="list-item">
          {collection.items.length > 0 ? (
            collection.items.map((item, index) => (
              <div key={index} className="list-item-container">
                <p>{index + 1} - {item.name}</p>
              </div>
            ))
          ) : (
            <p>No items available in this collection.</p>
          )}
        </div>
        <button type="button" className="close-button" onClick={onClose}>Close Preview</button>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
