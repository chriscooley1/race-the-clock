import React, { useEffect, useState, useCallback } from "react";
import { fetchPublicCollections, searchPublicCollections } from "../../api";  
import CollectionPreviewModal from "../../components/CollectionPreviewModal/CollectionPreviewModal";
import { AxiosError } from "axios"; 
import { useAuth0 } from "@auth0/auth0-react";
import { Collection as APICollection } from "../../api";
import axios from "axios";

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

  const fetchCollections = useCallback(async () => {
    try {
      console.log("Fetching public collections...");
      console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
      const fetchedCollections = await fetchPublicCollections();
      console.log("Fetched collections:", fetchedCollections);
      setCollections(fetchedCollections?.map(collection => ({
        ...collection,
        items: parseDescription(collection.description)
      })) || []);
    } catch (error) {
      console.error("Error fetching public collections:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
    <div className="flex flex-col items-center w-full min-h-screen pt-[50px] bg-[var(--background-color)] text-[var(--text-color)]">
      <h1 className="text-3xl font-bold mb-4">Discover Public Collections</h1>
      {user && <p className="mb-4">Welcome, {user.name}</p>}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by collection name or username"
            className="flex-grow p-2 border-5 border-black rounded-l-md font-['Patrick_Hand']"
          />
          <button 
            type="button" 
            onClick={handleSearch} 
            className="bg-green-500 text-white px-4 py-2 border-5 border-black rounded-r-md font-['Patrick_Hand'] font-bold hover:bg-green-600 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-around p-5 w-full">
        {collections.map((collection, index) => {
          const colorClass = `bg-[var(--color-${(index % 10) + 1})]`;
          const itemCount = collection.item_count ?? collection.items?.length ?? 0;
          return (
            <div key={collection.collection_id} className={`${colorClass} p-5 mb-5 flex-[0_0_calc(33.33%-20px)] m-2.5 flex flex-col items-center justify-start relative h-[300px] border-5 border-black`}>
              <h1 className="w-full text-black text-center text-xl font-bold border-5 border-black p-2.5 mb-2.5">{collection.name}</h1>
              <p className="text-black text-lg mb-1">Created by: {collection.creator_username}</p>
              <p className="text-black text-lg mb-4">{itemCount} items in collection</p>
              <button 
                type="button" 
                className="bg-green-500 text-white px-4 py-2 rounded-md font-bold hover:bg-green-600 transition duration-300 transform hover:scale-105 active:scale-95"
                onClick={() => openModal(collection)}
              >
                Preview Collection
              </button>
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
