import React, { useEffect, useState, useCallback } from "react";
import {
  fetchPublicCollections,
  searchPublicCollections,
  checkSubscription,
} from "../api";
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
  svg?: string;
  count?: number;
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
  const [sortOption, setSortOption] = useState<string>("date");
  const { getAccessTokenSilently } = useAuth0();

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
        (
          item: { name: string; svg?: string; count?: number },
          index: number,
        ) => ({
          id: index,
          name: item.name,
          svg: item.svg,
          count: item.count,
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

  const openModal = async (collection: APICollection) => {
    console.log("Opening modal for collection:", collection);
    const parsedCollection: Collection = {
      ...collection,
      items: parseDescription(collection.description),
    };

    // Check if the user is subscribed to this collection
    try {
      const isSubscribed = await checkSubscription(
        collection.collection_id,
        getAccessTokenSilently,
      );
      setActiveCollection({ ...parsedCollection, isSubscribed });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setActiveCollection({ ...parsedCollection, isSubscribed: false });
    }
  };

  const closeModal = () => setActiveCollection(null);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortCollections = useCallback(
    (collectionsToSort: Collection[]) => {
      switch (sortOption) {
        case "date":
          return [...collectionsToSort].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        case "alphabetical":
          return [...collectionsToSort].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        case "itemCount":
          return [...collectionsToSort].sort(
            (a, b) => (b.item_count || 0) - (a.item_count || 0),
          );
        case "category":
          return [...collectionsToSort].sort((a, b) =>
            a.category.localeCompare(b.category),
          );
        default:
          return collectionsToSort;
      }
    },
    [sortOption],
  );

  useEffect(() => {
    const sortedCollections = sortCollections(collections);
    if (JSON.stringify(sortedCollections) !== JSON.stringify(collections)) {
      setCollections(sortedCollections);
    }
  }, [sortOption, collections, sortCollections]);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[100px] md:pl-[250px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
        Discover Public Collections
      </h1>
      {user && <p className="mb-4">Welcome, {user.name}</p>}
      <div className="mb-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by collection name or username"
            className="mb-2 rounded-md border border-gray-300 p-2 sm:mb-0 sm:mr-2"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-green-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-green-600"
          >
            Search
          </button>
        </div>
      </div>
      <div className="font-caveat mb-4 flex items-center justify-center rounded border border-gray-300 bg-white p-2 text-black">
        <label htmlFor="sortSelect" className="text-sm font-bold">
          Sort collections by:
        </label>
        <select
          id="sortSelect"
          value={sortOption}
          onChange={handleSortChange}
          className="rounded-md border border-gray-300"
        >
          <option value="date">Date</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="itemCount">Item Count</option>
          <option value="category">Category</option>
        </select>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              className="flex flex-col items-center justify-start rounded-lg border border-gray-300 p-4"
              style={{ backgroundColor: lightColor }}
            >
              <h2
                className="mb-2 w-full rounded-md p-2 text-center text-lg font-bold text-black"
                style={{ backgroundColor: baseColor }}
              >
                {collection.name}
              </h2>
              <p className="mb-1 text-sm text-black">
                Created by:{" "}
                {collection.creator_display_name || collection.creator_username}
              </p>
              <p className="mb-1 text-sm text-black">
                Category: {collection.category}
              </p>
              <p className="mb-2 text-sm text-black">
                {itemCount} items in collection
              </p>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-sm font-bold text-black transition duration-300 hover:scale-105 active:scale-95"
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
