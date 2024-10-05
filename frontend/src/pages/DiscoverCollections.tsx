import React, { useEffect, useState, useCallback } from "react";
import { fetchPublicCollections, searchPublicCollections } from "../api";
import CollectionPreviewModal from "../components/CollectionPreviewModal";
import { AxiosError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Collection as APICollection } from "../api";
import axios from "axios";
import { lightenColor } from "../utils/colorUtils";
import { collectionColorSchemes } from "../constants/colorSchemes";
import { useTheme } from "../context/ThemeContext";

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
  const { adjustColorForColorblindness } = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { theme } = useTheme();

  const fetchCollections = useCallback(async () => {
    try {
      const fetchedCollections = await fetchPublicCollections();
      console.log("Fetched collections:", fetchedCollections);
      setCollections(
        fetchedCollections?.map((collection) => ({
          ...collection,
          items: parseDescription(collection.description),
        })) || [],
      );
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
      return JSON.parse(description).map(
        (item: { name: string }, index: number) => ({
          id: index,
          name: item.name,
        }),
      );
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
      setCollections(
        searchResults?.map((collection) => ({
          ...collection,
          items: JSON.parse(collection.description),
        })) || [],
      );
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
      items: parseDescription(collection.description),
    };
    setActiveCollection(parsedCollection);
  };

  const closeModal = () => setActiveCollection(null);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-3xl font-bold">Discover Public Collections</h1>
      {user && <p className="mb-4">Welcome, {user.name}</p>}
      <div>
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by collection name or username"
            className="border-5 grow rounded-l-md border-black p-2 font-['Patrick_Hand']"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="border-5 rounded-r-md border-black bg-green-500 px-4 py-2 font-['Patrick_Hand'] font-bold text-white transition duration-300 hover:bg-green-600"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-around p-5">
        {collections.map((collection, index) => {
          const baseColor = adjustColorForColorblindness(
            collectionColorSchemes[index % collectionColorSchemes.length]
              .backgroundColor,
          );
          const lightColor = adjustColorForColorblindness(
            lightenColor(baseColor, 0.7),
          );
          const itemCount =
            collection.item_count ?? collection.items?.length ?? 0;
          return (
            <div
              key={collection.collection_id}
              className="border-5 relative m-2.5 mb-5 flex h-[300px] flex-[0_0_calc(33.33%-20px)] flex-col items-center justify-start border-black p-5"
              style={{ backgroundColor: lightColor }}
            >
              <h1
                className="border-5 mb-2.5 w-full border-black p-2.5 text-center text-xl font-bold text-black"
                style={{ backgroundColor: baseColor }}
              >
                {collection.name}
              </h1>
              <p className="mb-1 text-lg text-black">
                Created by: {collection.creator_username}
              </p>
              <p className="mb-4 text-lg text-black">
                {itemCount} items in collection
              </p>
              <button
                type="button"
                className="rounded-md px-4 py-2 font-bold text-black transition duration-300 hover:scale-105 active:scale-95"
                style={{ backgroundColor: baseColor }}
                onClick={() => openModal(collection)}
              >
                Preview Collection
              </button>
            </div>
          );
        })}
      </div>
      {activeCollection && (
        <CollectionPreviewModal
          collection={activeCollection}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DiscoverCollections;
