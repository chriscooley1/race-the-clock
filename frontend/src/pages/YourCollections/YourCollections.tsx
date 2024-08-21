import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCollections, deleteCollectionById, duplicateCollection, updateCollection } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import SessionSettingsModal from "../../components/SessionSettingsModal/SessionSettingsModal";
import CollectionsNavBar from "../../components/CollectionsNavBar/CollectionsNavBar";
import EditCollectionModal from "../../components/EditCollectionModal/EditCollectionModal";
import "./YourCollections.css";
import "../../App.css"; // Global styles for the app

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: string;
  user_id: number;
  creator_username: string;
}

interface Item {
  name: string;
}

const getItemsCount = (description: string): number => {
  try {
    const items = JSON.parse(description);
    if (Array.isArray(items)) {
      return items.length;
    }
  } catch (error) {
    console.error("Error parsing description as JSON:", error);
  }
  return 0;
};

const YourCollections: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [sortOption, setSortOption] = useState<string>("date");
  const [isDuplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);
  const [collectionToDuplicate, setCollectionToDuplicate] = useState<Collection | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the access token first
        const data = await fetchCollections(token); // Pass the token to the API function
        setCollections(data);
        filterAndSortCollections(data, selectedCategory, sortOption);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    loadCollections();
  }, [selectedCategory, sortOption, getAccessTokenSilently]);

  const filterAndSortCollections = (collections: Collection[], category: string, sortOption: string) => {
    let filtered = collections;
    if (category !== "All Collections") {
      filtered = collections.filter((collection) => collection.category === category);
    }
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOption === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    setFilteredCollections(sorted);
  };

  const handleSaveUpdatedItems = async (newItems: string[]) => {
    setIsLoading(true); // Start loading
    try {
      if (selectedCollection) {
        // Filter out any empty strings from newItems
        const filteredItems = newItems.filter(item => item.trim() !== '');

        // Parse the existing items from the selected collection
        const existingItems = JSON.parse(selectedCollection.description || "[]");

        // Only keep the existing items that are still present in newItems
        const updatedItems = existingItems.filter(
          (item: { name: string }) => filteredItems.includes(item.name)
        );

        // Add new items that aren't already in the existing items
        filteredItems.forEach((item, index) => {
          if (!updatedItems.some((updatedItem: { name: string }) => updatedItem.name === item)) {
            updatedItems.push({ name: item, id: updatedItems.length + 1 });
          }
        });

        // Convert updatedItems to JSON string to store in the description
        const updatedDescription = JSON.stringify(updatedItems);

        console.log("Updating collection with data:", updatedItems);

        const updatedCollection = await updateCollection(
          selectedCollection.collection_id,
          selectedCollection.name,
          updatedDescription,
          getAccessTokenSilently
        );

        console.log("Updated collection returned from API:", updatedCollection);

        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.collection_id === updatedCollection.collection_id
              ? updatedCollection
              : col
          )
        );
        setSelectedCollection(updatedCollection); // Update the selected collection with the new data

        // Refetch the collections to ensure they're up-to-date
        const token = await getAccessTokenSilently();
        const refreshedCollections = await fetchCollections(token);
        setCollections(refreshedCollections);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollectionById(collectionId, getAccessTokenSilently);
      const updatedCollections = collections.filter(
        (collection) => collection.collection_id !== collectionId
      );
      setCollections(updatedCollections);
      filterAndSortCollections(updatedCollections, selectedCategory, sortOption);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleStartCollection = (collectionId: number) => {
    const collection = collections.find((col) => col.collection_id === collectionId);
    if (collection) {
      setSelectedCollection(collection);
      setShowModal(true);
    }
  };

  const handleEditButtonClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditModalOpen(true);
  };

  const handleDuplicateCollection = async () => {
    if (!collectionToDuplicate) return;
    try {
      const duplicatedCollection = await duplicateCollection(collectionToDuplicate, getAccessTokenSilently);
      setCollections((prevCollections) => [...prevCollections, duplicatedCollection]);
      filterAndSortCollections([...collections, duplicatedCollection], selectedCategory, sortOption);
      setDuplicateModalOpen(false);
    } catch (error) {
      console.error("Error duplicating collection:", error);
    }
  };

  const handleStartSession = (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string
  ) => {
    if (selectedCollection) {
      const sequenceItems = JSON.parse(selectedCollection.description || "[]");
      const sequence = sequenceItems.map((item: { name: string }) => item.name);
      const duration = min * 60 + sec;
      navigate("/fullscreen-display", {
        state: {
          sequence,
          duration,
          speed,
          textColor,
          shuffle,
        },
      });
      setShowModal(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
      timeZone: "America/Denver",
    }).format(date);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setDuplicateModalOpen(false);
      }
    };
    if (isDuplicateModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDuplicateModalOpen]);

  return (
    <div className="your-collections">
      <CollectionsNavBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <div className="control-panel">
        <div className="sort-options">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="date">Date Created</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <button
          type="button"
          className="duplicate-collection-button styled-button"
          onClick={() => setDuplicateModalOpen(true)}
        >
          Duplicate Collection
        </button>
      </div>
      <div className="collections-list">
        {filteredCollections.map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          return (
            <div key={collection.collection_id} className={`collection-item ${colorClass}`}>
              <h1>{collection.name}</h1>
              <p>{getItemsCount(collection.description)} items</p>
              <p>Created by you on {formatDate(collection.created_at)}</p>
              <button
                type="button"
                className="start-button"
                onClick={() => handleStartCollection(collection.collection_id)}
              >
                Start
              </button>
              <div className="button-group">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEditButtonClick(collection)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteCollection(collection.collection_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showModal && selectedCollection && (
        <SessionSettingsModal
          collectionName={selectedCollection.name}
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
          currentSettings={{
            speed: 500,
            textColor: "#000000",
          }}
        />
      )}
      {isEditModalOpen && selectedCollection && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          collectionName={selectedCollection.name}
          items={JSON.parse(selectedCollection.description || "[]").map((item: Item) => item.name)}
          onSave={handleSaveUpdatedItems} // <-- Pass the save handler here
        />
      )}
      {isDuplicateModalOpen && (
        <div className="modal-background">
          <div className="modal-content" ref={modalRef}>
            <h2>Duplicate Collection</h2>
            <label htmlFor="duplicate-collection-select">Select a collection to duplicate</label>
            <select
              id="duplicate-collection-select"
              value={collectionToDuplicate?.collection_id || ""}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const selectedCollection = collections.find(
                  (col) => col.collection_id === selectedId
                );
                setCollectionToDuplicate(selectedCollection || null);
              }}
            >
              <option value="" disabled>
                Select a collection to duplicate
              </option>
              {collections.map((collection) => (
                <option key={collection.collection_id} value={collection.collection_id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <div className="button-group">
              <button
                type="button"
                className="duplicate-button styled-button"
                disabled={!collectionToDuplicate}
                onClick={handleDuplicateCollection}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setDuplicateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && <div>Loading...</div>} {/* Optionally show loading status */}
    </div>
  );
};

export default YourCollections;