import React, { useEffect, useState } from "react";
import { fetchPublicCollections, searchPublicCollections } from "../../api";  
import CollectionPreviewModal from "../../components/CollectionPreviewModal/CollectionPreviewModal";
import { AxiosError } from "axios"; 
import "./DiscoverCollections.css";
import "../../App.css"; 
import { useAuth0 } from "@auth0/auth0-react";

interface Item {
  name: string;
}

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  creator_username: string;
  items: Item[];
  category: string; // Add category
  user_id: number;  // Add user_id
}

const DiscoverCollections: React.FC = () => {
  const { user } = useAuth0();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      console.log("Fetching public collections...");
      const fetchedCollections = await fetchPublicCollections();
      console.log("Fetched collections:", fetchedCollections);
      setCollections(fetchedCollections || []);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error fetching public collections:", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchCollections();
      return;
    }

    try {
      console.log("Searching collections with query:", searchQuery);
      const searchResults = await searchPublicCollections(searchQuery);
      console.log("Search results:", searchResults);
      setCollections(searchResults || []);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error searching collections:", error);
    }
  };

  const openModal = (collection: Collection) => {
    console.log("Opening modal for collection:", collection);
    setActiveCollection(collection);
  };

  const closeModal = () => setActiveCollection(null);

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      {user && <p>Welcome, {user.name}</p>}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by collection name or username"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="discover-collections-list">
        {collections.map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          return (
            <div key={collection.collection_id} className={`discover-collection-item ${colorClass}`}>
              <h1>{collection.name}</h1>
              <p>Created by: {collection.creator_username}</p>
              <p>{collection.items?.length || 0} items in collection</p>
              <button type="button" className="preview-button" onClick={() => openModal(collection)}>Preview Collection</button>
            </div>
          );
        })}
      </div>
      {activeCollection && (
        <CollectionPreviewModal collection={activeCollection} onClose={closeModal} />
      )}
    </div>
  );
};

export default DiscoverCollections;
