import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useTheme } from "../context/ThemeContext";
import SessionSettingsModal from "../components/SessionSettingsModal";
import CollectionsNavBar from "../components/CollectionsNavBar";
import EditCollectionModal from "../components/EditCollectionModal"; // Import the modal
import { useAuth } from "../context/AuthContext"; // Import useAuth for authentication

// Define the Collection type
interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: string; // Add category field to match the category filtering
}

const YourCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [speed, setSpeed] = useState<number>(500);
  const [textColor, setTextColor] = useState<string>("#000000");
  const { theme } = useTheme();
  const { token } = useAuth(); // Destructure token from useAuth
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  // Fetch collections from the backend
  const fetchCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/me/collections", {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed in headers
        },
      });
      const data: Collection[] = response.data;
      setCollections(data);
      filterCollections(data, selectedCategory);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchCollections(); // Call fetchCollections when the component mounts or dependencies change
  }, [selectedCategory, token]); // Fetch collections when category or token changes

  const filterCollections = (collections: Collection[], category: string) => {
    if (category === "All Collections") {
      setFilteredCollections(collections);
    } else {
      setFilteredCollections(
        collections.filter((collection) => collection.category === category)
      );
    }
  };

  const getItemsCount = (description: string): number => {
    try {
      const items = JSON.parse(description);
      if (Array.isArray(items)) {
        return items.length;
      }
    } catch (error) {
      console.error("Error parsing description as JSON:", error);
    }
    return 0; // Default to 0 if parsing fails or is not an array
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await axios.delete(`http://localhost:8000/collections/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed in headers
        },
      });
      const updatedCollections = collections.filter(
        (collection) => collection.collection_id !== collectionId
      );
      setCollections(updatedCollections);
      filterCollections(updatedCollections, selectedCategory);
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

  const handleStartSession = (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string,
    themeClassName: string
  ) => {
    if (selectedCollection) {
      const sequenceItems = JSON.parse(selectedCollection.description || "[]");
      const sequence = sequenceItems.map((item: { name: string }) => item.name);
      const duration = min * 60 + sec; // Convert minutes and seconds to total seconds
      navigate("/fullscreen-display", {
        state: {
          sequence,
          duration,
          speed,
          textColor,
          shuffle,
          theme: themeClassName,
        },
      });
      setShowModal(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="your-collections">
      <CollectionsNavBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <div className="collections-list">
        {filteredCollections.map((collection) => (
          <div key={collection.collection_id} className="collection-item">
            <h1>{collection.name}</h1>
            <p>{getItemsCount(collection.description)} items</p>
            <p>Created by you on {new Date(collection.created_at).toLocaleDateString()}</p>
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
        ))}
      </div>
      {showModal && selectedCollection && (
        <SessionSettingsModal
          collectionName={selectedCollection.name}
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
          currentSettings={{
            speed: speed,
            theme: theme,
            textColor: textColor,
          }}
        />
      )}
      {isEditModalOpen && selectedCollection && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          collectionName={selectedCollection.name}
          items={JSON.parse(selectedCollection.description || '[]')}
          onSave={(newItems) => {
            console.log('Save new items:', newItems);
            // Implement saving logic here
          }}
        />
      )}
    </div>
  );
};

export default YourCollections;
