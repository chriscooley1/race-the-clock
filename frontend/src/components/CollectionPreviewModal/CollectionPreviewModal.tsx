import React, { useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { subscribeToCollection, Collection } from "../../api";
import "./CollectionPreviewModal.css";

interface CollectionPreviewModalProps {
  collection: Collection;
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<CollectionPreviewModalProps> = ({ collection, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null); // Create a ref for the modal content

  const handleSubscribe = async () => {
    try {
      await subscribeToCollection(collection.collection_id, getAccessTokenSilently);
      setIsSubscribed(true);
      alert("You have subscribed to this collection!");
    } catch (error) {
      console.error("Error subscribing to collection:", error);
      alert("Failed to subscribe to this collection.");
    }
  };

  // Close the modal if a click happens outside of the modal content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="prev-modal-background">
      <div className="prev-modal-content" ref={modalRef}> {/* Attach the ref to the modal content */}
        <h2>{collection.name}</h2>
        <p>{collection.items.length} items in collection</p>
        
        <ul>
          {collection.items.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
        
        <div className="prev-button-group">
          <button type="button" onClick={onClose}>Close Preview</button>
          {!isSubscribed && (
            <button type="button" onClick={handleSubscribe}>Subscribe to Collection</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
