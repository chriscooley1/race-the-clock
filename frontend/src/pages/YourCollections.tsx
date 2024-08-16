import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SessionSettingsModal from "../components/SessionSettingsModal";
import CollectionsNavBar from "../components/CollectionsNavBar";
import EditCollectionModal from "../components/EditCollectionModal";
import "../App.css";

// Import the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Collection {
  collection_id: number;
  name: string;
  description: string; // Ensure this is a JSON string
  created_at: string; // Ensure this is a date string
  category: string;
  user_id: number;
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

const YourCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [sortOption, setSortOption] = useState<string>("date");
  const [isDuplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);
  const [collectionToDuplicate, setCollectionToDuplicate] = useState<Collection | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  // Remove hardcoded localhost URL and use API_BASE_URL instead
  const apiBaseUrl = API_BASE_URL;

  // Ref for the modal content to check if clicks are outside
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users/me/collections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Collection[] = response.data;
        setCollections(data);
        filterAndSortCollections(data, selectedCategory, sortOption);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, [selectedCategory, sortOption, token]);

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

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/collections/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

    const newCollectionName = `${collectionToDuplicate.name} Copy`;
    const newCollection = {
      name: newCollectionName,
      description: collectionToDuplicate.description,
      category: collectionToDuplicate.category,
      status: "private", // Ensure you include any default values expected by the API
      user_id: collectionToDuplicate.user_id, // Ensure you provide the user_id if required by your API
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/collections`, newCollection, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const duplicatedCollection: Collection = response.data;
      setCollections((prevCollections) => [...prevCollections, duplicatedCollection]);
      filterAndSortCollections([...collections, duplicatedCollection], selectedCategory, sortOption);
      setDuplicateModalOpen(false); // Close the modal after duplication
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
      timeZone: "America/Denver", // Adjust the time zone as needed
    }).format(date);
  };

  // Effect to handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setDuplicateModalOpen(false); // Close the modal if clicked outside
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
          const colorClass = `color-${(index % 10) + 1}`; // Cycles through color-1 to color-10
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
          onSave={(newItems) => {
            console.log("Save new items:", newItems);
          }}
        />
      )}
      {isDuplicateModalOpen && (
        <div className="modal-background">
          <div className="modal-content" ref={modalRef}>
            <h2>Duplicate Collection</h2>
            <select
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
    </div>
  );
};

export default YourCollections;
