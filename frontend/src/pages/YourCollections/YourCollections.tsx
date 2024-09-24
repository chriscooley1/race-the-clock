import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCollections, deleteCollectionById, duplicateCollection, updateCollection } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import SessionSettingsModal from "../../components/SessionSettingsModal/SessionSettingsModal";
import CollectionsNavBar from "../../components/CollectionsNavBar/CollectionsNavBar";
import EditCollectionModal from "../../components/EditCollectionModal/EditCollectionModal";
import "./YourCollections.css";
import "../../App.css";
import axios from "axios";

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: string;
  user_id: number;
  creator_username: string;
  items: Item[];
  type: string; // Add this line
}
interface Item {
  name: string;
}
const getItemsCount = (description: string | undefined): number => {
  if (!description) return 0;
  try {
    const items = JSON.parse(description);
    return Array.isArray(items) ? items.length : 0;
  } catch {
    console.error("Error parsing description:", description);
    return 0;
  }
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log("Fetching user collections...");
        console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
        const collections = await fetchCollections(getAccessTokenSilently);
        console.log("Loaded collections:", collections);
        if (Array.isArray(collections)) {
          setCollections(collections);
          filterAndSortCollections(collections, selectedCategory, sortOption);
        } else {
          console.error("Unexpected data format:", collections);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
        }
      }
    };

    loadCollections();
  }, [selectedCategory, sortOption, getAccessTokenSilently]);

  const filterAndSortCollections = (
    collections: Collection[],
    category: string,
    sortOption: string
  ) => {
    let filtered = collections;
  
    // Filter collections based on selected category, but include all in "All Collections"
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
      console.log("Saving updated items:", newItems);
      if (selectedCollection) {
        // Filter out any empty strings from newItems
        const filteredItems = newItems.filter(item => item.trim() !== "");

        // Parse the existing items from the selected collection
        const existingItems = JSON.parse(selectedCollection.description || "[]");

        // Only keep the existing items that are still present in newItems
        const updatedItems = existingItems.filter(
          (item: { name: string }) => filteredItems.includes(item.name)
        );

        // Add new items that aren't already in the existing items
        filteredItems.forEach((item) => {
          if (!updatedItems.some((updatedItem: { name: string }) => updatedItem.name === item)) {
            updatedItems.push({ name: item });
          }
        });

        // Convert updatedItems to JSON string to store in the description
        const updatedDescription = JSON.stringify(updatedItems);

        // Log the data to ensure it's correct
        console.log({
          name: selectedCollection.name,
          description: updatedDescription,
          category: selectedCollection.category,
        });

        // Update the collection with the necessary fields
        const updatedCollection = await updateCollection(
          selectedCollection.collection_id,
          selectedCollection.name,
          updatedDescription,
          selectedCollection.category,
          getAccessTokenSilently
        );

        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.collection_id === updatedCollection.collection_id
              ? updatedCollection
              : col
          )
        );
        setSelectedCollection(updatedCollection); // Update the selected collection with the new data

        // Refetch the collections to ensure they're up-to-date
        const refreshedCollections = await fetchCollections(getAccessTokenSilently);
        setCollections(refreshedCollections);
        console.log("Updated collection:", selectedCollection);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleStartCollection = (collectionId: number) => {
    const collection = collections.find((col) => col.collection_id === collectionId);
    if (collection) {
      if (collection.category === "Math Problems") {
        navigate("/math-collection", {
          state: { collection },
        });
      } else {
        setSelectedCollection(collection);
        setShowModal(true);
      }
    }
  };

  const handleEditButtonClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditModalOpen(true);
  };

  const handleDuplicateCollection = async () => {
    if (!collectionToDuplicate) return;
    try {
      console.log("Duplicating collection:", collectionToDuplicate);
      const duplicatedCollection = await duplicateCollection(collectionToDuplicate, getAccessTokenSilently);
      console.log("Duplicated collection:", duplicatedCollection);
      setCollections((prevCollections) => [...prevCollections, duplicatedCollection]);
      filterAndSortCollections([...collections, duplicatedCollection], selectedCategory, sortOption);
      setDuplicateModalOpen(false);
    } catch (error) {
      console.error("Error duplicating collection:", error);
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      console.log("Deleting collection with ID:", collectionId);
      await deleteCollectionById(collectionId, getAccessTokenSilently);
      const updatedCollections = collections.filter(
        (collection) => collection.collection_id !== collectionId
      );
      console.log("Updated collections after deletion:", updatedCollections);
      setCollections(updatedCollections);
      filterAndSortCollections(updatedCollections, selectedCategory, sortOption);
    } catch (error) {
      console.error("Error deleting collection:", error);
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
      const sequence = sequenceItems.map((item: { name: string; svg?: string; count?: number }) => ({
        name: item.name,
        svg: item.svg,
        count: item.count
      }));
      const duration = min * 60 + sec;
      navigate("/fullscreen-display", {
        state: {
          sequence,
          duration,
          speed,
          textColor,
          shuffle,
          category: selectedCollection.category,
          type: selectedCollection.type, // Add this line
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
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Invalid Date";
    }
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === "Enter" && collectionToDuplicate) {
      handleDuplicateCollection();
    }
  };

  const parseDescription = (description: string | undefined): string[] => {
    if (!description) return [];
    try {
      const parsed = JSON.parse(description);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing description:", error);
      return [];
    }
  };

  return (
    <div className="your-collections">
      <CollectionsNavBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <div className="control-panel">
        <div className="sort-options">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortOption} onChange={handleSortChange} onKeyPress={handleKeyPress}>
            <option value="date">Date Created</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <button
          type="button"
          className="duplicate-collection-button your-styled-button"
          onClick={() => setDuplicateModalOpen(true)}
        >
          Duplicate Collection
        </button>
      </div>
      <div className="your-collections-list">
        {filteredCollections.map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          return (
            <div key={collection.collection_id} className={`your-collection-item ${colorClass}`}>
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
              <div className="your-button-group">
                <button
                  type="button"
                  className="your-edit-button"
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
          items={parseDescription(selectedCollection.description)}
          onSave={handleSaveUpdatedItems}
        />
      )}
      {isDuplicateModalOpen && (
        <div className="your-modal-background">
          <div className="your-modal-content" ref={modalRef}>
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
            <div className="your-button-group">
              <button
                type="button"
                className="duplicate-button your-styled-button"
                disabled={!collectionToDuplicate}
                onClick={handleDuplicateCollection}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="your-cancel-button"
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
