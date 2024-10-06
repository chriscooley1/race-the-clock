import React, { useRef, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { subscribeToCollection, Collection, checkSubscription } from "../api";
import { useTheme } from "../context/ThemeContext";

interface CollectionPreviewModalProps {
  collection: Collection;
  onClose: () => void;
}

const CollectionPreviewModal: React.FC<CollectionPreviewModalProps> = ({
  collection,
  onClose,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const checkIfSubscribed = async () => {
      try {
        const subscribed = await checkSubscription(
          collection.collection_id,
          getAccessTokenSilently,
        );
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    checkIfSubscribed();
  }, [collection.collection_id, getAccessTokenSilently]);

  const handleSubscribe = async () => {
    try {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className={`relative max-h-[90vh] w-11/12 overflow-hidden rounded-lg p-4 shadow-lg md:w-3/4 lg:w-1/2 ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="mb-4 text-center text-2xl font-bold">
          {collection.name}
        </h2>
        <p className="mb-4 text-center">
          {collection.items.length} items in collection
        </p>

        {/* Scrollable section */}
        <div className="max-h-[50vh] w-full overflow-y-auto px-4">
          <ul className="space-y-2">
            {collection.items.map((item, index) => (
              <li key={index} className="py-2 text-center text-lg">
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isSubscribed}
            className={`rounded px-6 py-2 font-bold text-white transition-all ${
              isSubscribed
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-500 hover:scale-105 hover:bg-blue-600 active:scale-95"
            }`}
          >
            {isSubscribed ? "Already Subscribed" : "Subscribe to Collection"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-red-500 px-6 py-2 font-bold text-white hover:scale-105 hover:bg-red-600 active:scale-95"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
