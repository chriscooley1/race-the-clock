import React, { useEffect, useState, useCallback } from "react";
import {
  fetchPublicCollections,
  searchPublicCollections,
  checkSubscription,
  getCurrentUser,
} from "../../api";
import CollectionPreviewModal from "../../components/CollectionPreviewModal";
import { AxiosError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Collection as APICollection } from "../../api";
import axios from "axios";
import { lightenColor } from "../../utils/colorUtils";
import { collectionColorSchemes } from "../../constants/colorSchemes";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsDiscoverCollections } from "./tourStepsDiscoverCollections";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";
import FeedbackForm from "../../components/FeedbackForm";
import { categoryColors } from "../../constants/categoryColors";

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
  const { theme, adjustColorForColorblindness } = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("date");
  const { getAccessTokenSilently } = useAuth0();
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    Record<string, boolean>
  >({});
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isSearchInputVisible: true,
    isSortSelectVisible: true,
    isCollectionsGridVisible: true,
    isPreviewButtonVisible: true,
    isDotCountTypeVisible: false,
    isMinDotsVisible: false,
    isMaxDotsVisible: false,
    isTypeSelectVisible: false,
    isItemCountVisible: false,
    isCollectionItemCountVisible: false,
    isDotColorVisible: false,
    isDotShapeVisible: false,
    isGenerateRandomSequenceButtonVisible: false,
    isFileUploadVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
    isSessionSettingsModalVisible: false,
    isEditCollectionModalVisible: false,
    isDuplicateCollectionModalVisible: false,
    isCollectionPreviewModalVisible: false,
    isNextButtonVisible: false,
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] = useState<string>("");
  const [searchType, setSearchType] = useState<'name' | 'creator'>('name');

  // Define the steps variable
  const steps = tourStepsDiscoverCollections(visibilityStates); // Create tour steps based on visibility states

  // Add a function to start the tour
  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  useEffect(() => {
    // Start the tour when the component mounts
    startTour();
  }, []);

  // Example of updating visibility states based on some logic
  useEffect(() => {
    // You can set visibility states based on your application logic
    setVisibilityStates((prevStates) => ({
      ...prevStates, // Keep the previous state
      isSearchInputVisible: true, // Set to true or false based on your logic
      isSortSelectVisible: true, // Set to true or false based on your logic
      isCollectionsGridVisible: collections.length > 0, // Show grid if there are collections
      isPreviewButtonVisible: activeCollection !== null, // Show preview button if a collection is active
    }));
  }, [collections, activeCollection]); // Dependencies to trigger updates

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const fetchCollections = useCallback(async () => {
    try {
      const fetchedCollections = await fetchPublicCollections();
      console.log("Fetched collections:", fetchedCollections);
      const collectionsWithItems =
        fetchedCollections?.map((collection) => ({
          ...collection,
          items: parseDescription(collection.description),
        })) || [];

      // Check subscription status for all collections
      const subscriptionChecks = collectionsWithItems.map(
        async (collection) => {
          const isSubscribed = await checkSubscription(
            collection.collection_id,
            getAccessTokenSilently,
          );
          return { [collection.collection_id]: isSubscribed };
        },
      );
      const subscriptionResults = await Promise.all(subscriptionChecks);
      const newSubscriptionStatus = Object.assign({}, ...subscriptionResults);
      setSubscriptionStatus(newSubscriptionStatus);

      setCollections(collectionsWithItems);
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
  }, [getAccessTokenSilently]);

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

  // Group collections by category
  const groupedCollections = collections.reduce((acc, collection) => {
    const category = collection.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(collection);
    return acc;
  }, {} as Record<string, Collection[]>);

  // Update the search function
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchCollections();
      return;
    }

    try {
      console.log(`Searching collections by ${searchType}:`, searchQuery);
      const searchResults = await searchPublicCollections(searchQuery, searchType);
      const processedResults = searchResults?.map((collection) => ({
        ...collection,
        items: JSON.parse(collection.description),
      })) || [];
      setCollections(processedResults);
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

    // Use the subscription status from the state
    const isSubscribed = subscriptionStatus[collection.collection_id] || false;
    setActiveCollection({ ...parsedCollection, isSubscribed });
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

  const adjustColorForTheme = useCallback(
    (color: string) => {
      return adjustColorForColorblindness(color);
    },
    [adjustColorForColorblindness],
  );

  const handleSubscribe = (collectionId: string) => {
    setSubscriptionStatus(prev => ({
      ...prev,
      [collectionId]: true
    }));
  };

  useEffect(() => {
    const fetchUserDisplayName = async () => {
      if (user) {
        try {
          const userData = await getCurrentUser(getAccessTokenSilently);
          setUserDisplayName(userData.display_name || user.name);
        } catch (error) {
          console.error("Error fetching user display name:", error);
          setUserDisplayName(user.name || ""); // Fallback to user.name if fetch fails
        }
      }
    };
    fetchUserDisplayName();
  }, [user, getAccessTokenSilently]);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[100px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } mt-4`}
      style={{ color: theme.originalTextColor, marginLeft: "20px" }}
    >
      <h1 className="discover-collections-page mb-4 text-2xl font-bold sm:text-3xl">
        Discover Public Collections
      </h1>
      {user && <p className="mb-4">Welcome, {userDisplayName}</p>}
      <div className="mb-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'name' | 'creator')}
            className={`rounded-md border border-black p-2 ${
              theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            aria-label="Search type selector"
          >
            <option value="name">Search by Name</option>
            <option value="creator">Search by Creator</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search by ${searchType === 'name' ? 'collection name' : 'creator'}`}
            className={`search-collections-input rounded-md border border-black p-2`}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="search-collections-button rounded-md border border-black bg-green-500 px-4 py-2 font-bold text-white"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mb-4 w-full max-w-md">
        <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center">
          <label htmlFor="sortSelect" className="mb-2 text-sm font-bold sm:mb-0 sm:mr-2">
            Sort collections by:
          </label>
          <select
            id="sortSelect"
            value={sortOption}
            onChange={handleSortChange}
            className={`sort-collections-select rounded-md border border-black p-2 ${
              theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            aria-label="Sort collections"
          >
            <option value="date">Date</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="itemCount">Item Count</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="mt-4 rounded border border-black bg-blue-500 px-4 py-2 text-white"
      >
        Give Feedback
      </button>

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
      {Object.entries(groupedCollections).map(([category, categoryCollections]) => (
        <div key={category} className="mb-8 w-full">
          <h2 className="mb-4 text-xl font-bold">{category}</h2>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCollections.map((collection, index) => {
              const baseColor = adjustColorForTheme(
                collectionColorSchemes[index % collectionColorSchemes.length]
                  .backgroundColor,
              );
              const lightColor = baseColor ? lightenColor(baseColor, 0.7) : "";
              const itemCount =
                collection.item_count ?? collection.items?.length ?? 0;
              return (
                <div
                  key={collection.collection_id}
                  className="collection-card min-w-[375px] rounded-lg border-4 border-white p-4 shadow-lg"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="flex h-full w-full flex-col">
                    <h2
                      className="border-5 w-full rounded-t-lg border-b-0 border-black p-2.5 text-center text-xl font-bold text-black"
                      style={{ backgroundColor: baseColor }}
                    >
                      {collection.name}
                    </h2>
                    <div
                      className="border-5 flex h-full w-full flex-col rounded-b-lg border-black"
                      style={{ 
                        backgroundColor: lightColor,
                        transition: "background-color 0.3s ease"
                      }}
                    >
                      <div className="flex h-full w-full flex-col p-4">
                        <div className="mb-auto text-center">
                          <p className="mb-1 text-base font-bold text-black">
                            {itemCount} {itemCount === 1 ? "item" : "items"} in collection
                          </p>
                          <p className={`mb-1 text-sm ${theme.isDarkMode ? "text-white" : "text-black"}`}>
                            Created by:{" "}
                            {collection.creator_display_name || collection.creator_username || "Anonymous"}
                          </p>
                          <p className={`mb-1 text-sm ${theme.isDarkMode ? "text-white" : "text-black"}`}>
                            Category:{" "}
                            <span className={`ml-2 inline-block rounded-full px-3 py-1 text-white ${categoryColors[collection.category as keyof typeof categoryColors] || "bg-gray-500"}`}>
                              {collection.category}
                            </span>
                          </p>
                        </div>
                        <div className="mt-auto pt-4">
                          <button
                            type="button"
                            className="preview-collection-button w-full cursor-pointer rounded-lg border-4 border-black p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{ backgroundColor: baseColor }}
                            onClick={() => openModal(collection)}
                          >
                            {subscriptionStatus[collection.collection_id]
                              ? "Already Subscribed"
                              : "Preview Collection"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {activeCollection && (
        <CollectionPreviewModal
          collection={activeCollection}
          onClose={closeModal}
          isSubscribed={activeCollection.isSubscribed || false}
          onSubscribe={handleSubscribe}
        />
      )}
      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="discoverCollections"
      />
    </div>
  );
};

export default DiscoverCollections;
