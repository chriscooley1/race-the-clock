import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, deleteCollection } from "../api";
import "../App.css";
import { useTheme } from "../context/ThemeContext";
import SessionSettingsModal from "../components/SessionSettingsModal";
import CollectionsNavBar from "../components/CollectionsNavBar";

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
  const userId = 1; // Replace with the actual user ID
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data: Collection[] = await getCollections(userId);
        setCollections(data);
        filterCollections(data, selectedCategory);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, [userId, selectedCategory]);

  const filterCollections = (collections: Collection[], category: string) => {
    if (category === "All Collections") {
      setFilteredCollections(collections);
    } else {
      setFilteredCollections(
        collections.filter((collection) => collection.category === category)
      );
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollection(collectionId);
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
            <p>{JSON.parse(collection.description || "[]").length} items</p>
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
                // Add onClick logic when ready to implement
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
          collectionName={selectedCollection.name} // Pass collection name
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
          currentSettings={{
            speed: speed,
            theme: theme,
            textColor: textColor,
          }}
        />
      )}
    </div>
  );
};

export default YourCollections;
