import React, { useRef, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { subscribeToCollection, Collection } from "../api";
import { useTheme } from "../context/ThemeContext";

interface CollectionPreviewModalProps {
  collection: Collection;
  onClose: () => void;
  isSubscribed: boolean;
  onSubscribe?: (collectionId: string) => void;
}

const CollectionPreviewModal: React.FC<CollectionPreviewModalProps> = ({
  collection,
  onClose,
  isSubscribed: initialIsSubscribed,
  onSubscribe,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const decodeSvg = (encodedSvg: string) => {
    return decodeURIComponent(encodedSvg.replace(/^data:image\/svg\+xml,/, ""));
  };

  const handleSubscribe = async () => {
    if (isSubscribed) return;

    try {
      await subscribeToCollection(
        collection.collection_id,
        getAccessTokenSilently,
      );
      setIsSubscribed(true);
      onSubscribe?.(collection.collection_id.toString());
      alert("You have subscribed to this collection!");
      onClose();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("already subscribed")
      ) {
        setIsSubscribed(true);
        alert("You are already subscribed to this collection.");
        onClose();
      } else {
        console.error("Error subscribing to collection:", error);
        alert("An error occurred while subscribing to the collection.");
      }
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
        className={`relative max-h-[90vh] overflow-hidden rounded-lg p-4 shadow-lg ${
          collection.category === "Number Sense"
            ? "w-11/12 md:w-3/4 lg:w-2/3"
            : "w-11/12 max-w-md"
        }`}
        style={{
          backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
          color: theme.isDarkMode ? "#FFFFFF" : "#000000",
        }}
      >
        <h2 className="mb-4 text-center text-2xl font-bold">
          {collection.name}
        </h2>
        <p className="mb-4 text-center">
          {collection.items.length} items in collection
        </p>

        {/* Scrollable section */}
        <div className="max-h-[50vh] w-full overflow-y-auto px-4">
          {collection.category === "Number Sense" ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collection.items.map((item, index) => (
                <li
                  key={index}
                  className="flex h-64 flex-col items-center justify-between rounded border p-4"
                >
                  <div className="flex h-40 w-full grow items-center justify-center">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: decodeSvg(item.svg || ""),
                      }}
                      className="max-h-full max-w-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">{item.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2 text-center">
              {collection.items.map((item, index) => (
                <li key={index} className="text-lg">
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isSubscribed}
            className={`rounded px-6 py-2 font-bold text-white transition-all ${
              isSubscribed
                ? "cursor-not-allowed border border-black bg-gray-400"
                : "border border-black bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
            }`}
          >
            {isSubscribed ? "Already Subscribed" : "Subscribe to Collection"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-black bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600 active:bg-red-700"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreviewModal;
