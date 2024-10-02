import React, { useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { subscribeToCollection, Collection } from "../api";

interface CollectionPreviewModalProps {
  collection: Collection;
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<CollectionPreviewModalProps> = ({
  collection,
  onClose,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = async () => {
    try {
      console.log(
        "Attempting to subscribe to collection:",
        collection.collection_id,
      );
      await subscribeToCollection(
        collection.collection_id,
        getAccessTokenSilently,
      );
      setIsSubscribed(true);
      alert("You have subscribed to this collection!");
    } catch (error) {
      console.error("Error subscribing to collection:", error);
      alert("Failed to subscribe to this collection.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70">
      <div
        ref={modalRef}
        className="flex max-h-[90vh] w-11/12 flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-4 text-center text-gray-800 shadow-lg md:w-3/4 md:p-6 lg:w-1/2"
      >
        <h2 className="mb-4 text-2xl font-bold">{collection.name}</h2>
        <p className="mb-4">{collection.items.length} items in collection</p>

        <ul className="mb-6 w-full">
          {collection.items.map((item, index) => (
            <li key={index} className="py-2 text-lg">
              {item.name}
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-red-500 px-6 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-red-600 active:scale-95"
          >
            Close Preview
          </button>
          {!isSubscribed && (
            <button
              type="button"
              onClick={handleSubscribe}
              className="rounded bg-blue-500 px-6 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 active:scale-95"
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
