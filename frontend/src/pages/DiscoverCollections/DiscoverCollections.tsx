import React, { useEffect, useState } from "react";
import { fetchPublicCollections, searchPublicCollections } from "../../api";  
import CollectionPreviewModal from "../../components/CollectionPreviewModal/CollectionPreviewModal";
import { AxiosError } from "axios"; 
import "./DiscoverCollections.css";
import "../../App.css"; 
import { useAuth0 } from "@auth0/auth0-react";
import { Collection as APICollection } from "../../api";  // Import the API Collection type

interface Item {
  id: number;
  name: string;
}

interface Collection extends Omit<APICollection, "items"> {
  items: Item[];
  item_count?: number;
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
      setCollections(fetchedCollections?.map(collection => ({
        ...collection,
        items: parseDescription(collection.description)
      })) || []);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error fetching public collections:", error);
    }
  };

  const parseDescription = (description: string): Item[] => {
    try {
      return JSON.parse(description).map((item: { name: string }, index: number) => ({
        id: index,
        name: item.name
      }));
    } catch {
      // If parsing fails, treat the description as a single item
      return [{ id: 0, name: description }];
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
      setCollections(searchResults?.map(collection => ({
        ...collection,
        items: JSON.parse(collection.description)
      })) || []);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error searching collections:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const openModal = (collection: APICollection) => {
    console.log("Opening modal for collection:", collection);
    const parsedCollection: Collection = {
      ...collection,
      items: parseDescription(collection.description)
    };
    setActiveCollection(parsedCollection);
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
          onKeyPress={handleKeyPress}
          placeholder="Search by collection name or username"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="discover-collections-list">
        {collections.map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          const itemCount = collection.item_count ?? collection.items?.length ?? 0;
          return (
            <div key={collection.collection_id} className={`discover-collection-item ${colorClass}`}>
              <h1>{collection.name}</h1>
              <p>Created by: {collection.creator_username}</p>
              <p>{itemCount} items in collection</p>
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
