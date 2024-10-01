import React, { useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { subscribeToCollection, Collection } from "../../api";

interface CollectionPreviewModalProps {
  collection: Collection;
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<CollectionPreviewModalProps> = ({ collection, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = async () => {
    try {
      console.log("Attempting to subscribe to collection:", collection.collection_id);
      await subscribeToCollection(collection.collection_id, getAccessTokenSilently);
      setIsSubscribed(true);
      alert("You have subscribed to this collection!");
    } catch (error) {
      console.error("Error subscribing to collection:", error);
      alert("Failed to subscribe to this collection.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        console.log("Clicked outside the modal, closing...");
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("Cleaning up event listener for handleClickOutside");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-hidden">
      <div ref={modalRef} className="bg-white p-4 md:p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] text-center text-gray-800 shadow-lg flex flex-col items-center justify-center overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{collection.name}</h2>
        <p className="mb-4">{collection.items.length} items in collection</p>
        
        <ul className="mb-6 w-full">
          {collection.items.map((item, index) => (
            <li key={index} className="py-2 text-lg">{item.name}</li>
          ))}
        </ul>
        
        <div className="flex flex-col sm:flex-row justify-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            Close Preview
          </button>
          {!isSubscribed && (
            <button
              type="button"
              onClick={handleSubscribe}
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Subscribe to Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
