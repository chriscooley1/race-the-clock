import React, { useEffect, useState } from "react";
import axios from "axios";
import CollectionPreviewModal from "../components/CollectionPreviewModal"; // Import your modal component

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  creator_username: string;
  items?: string[]; // Items are optional and loaded on demand
}

const DiscoverCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  useEffect(() => {
    const fetchPublicCollections = async () => {
      try {
        const response = await axios.get<Collection[]>("http://localhost:8000/collections/public");
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching public collections:", error);
      }
    };
    fetchPublicCollections();
  }, []);

  const openModal = async (collection) => {
    if (!collection.items) {
      try {
        const response = await axios.get(`http://localhost:8000/collections/${collection.collection_id}/items`);
        collection.items = response.data; // Attach fetched items to the collection
      } catch (error) {
        console.error("Error fetching collection items:", error);
        // Handle errors, e.g., showing a notification or message to the user
      }
    }
    setActiveCollection(collection); // Now with items loaded
  };  

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      <div className="collections-list">
        {collections.map(collection => (
          <div key={collection.collection_id} className="collection-item">
            <h2>{collection.name}</h2>
            <p>Created by {collection.creator_username} on {new Date(collection.created_at).toLocaleDateString()}</p>
            <button type="button" onClick={() => openModal(collection)}>Preview Collection</button>
          </div>
        ))}
      </div>
      {activeCollection && (
        <CollectionPreviewModal collection={activeCollection} onClose={closeModal} />
      )}
    </div>
  );
};

export default DiscoverCollections;
