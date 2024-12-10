import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCollections,
  deleteCollectionById,
  duplicateCollection,
  updateCollection,
} from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import SessionSettingsModal from "../../components/SessionSettingsModal";
import EditCollectionModal from "../../components/EditCollectionModal";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { collectionColorSchemes } from "../../constants/colorSchemes";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsYourCollections } from "./tourStepsYourCollections";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";
import { useCompletion } from "../../context/CompletionContext";
import { categoryColors } from "../../constants/categoryColors";
import { lightenColor } from "../../utils/colorUtils";

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: keyof typeof categoryColors;
  user_id: number;
  creator_username: string;
  creator_display_name: string;
  items: Item[];
  type: string;
  status: string;
  is_public: boolean;
}

interface Item {
  name: string;
}

const getItemsCount = (description: string | undefined): number => {
  if (!description) return 0;
  try {
    const items = JSON.parse(description);
    return Array.isArray(items) ? items.length : 0;
  } catch {
    console.error("Error parsing description:", description);
    return 0;
  }
};

const parseDescription = (
  description: string,
): { name: string; id?: number; svg?: string; count?: number }[] => {
  try {
    const parsed = JSON.parse(description);
    return Array.isArray(parsed)
      ? parsed.map((item, index) => ({
          name:
            typeof item === "object" && item !== null
              ? item.name
              : String(item),
          id:
            typeof item === "object" && item !== null && "id" in item
              ? item.id
              : index,
          svg: typeof item === "object" && item !== null ? item.svg : undefined,
          count:
            typeof item === "object" && item !== null ? item.count : undefined,
        }))
      : [];
  } catch {
    return [{ name: description }];
  }
};

declare global {
  interface Window {
    savePreferenceTimeout: ReturnType<typeof setTimeout> | null;
  }
}

const YourCollections: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Collections");
  const [sortOption, setSortOption] = useState<string>(
    localStorage.getItem("sortPreference") || "date",
  );
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { theme, adjustColorForColorblindness } = useTheme();
  const { updateCompletionCount } = useCompletion();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categories = [
    "All Collections",
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  // Visibility states for the tour
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
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
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isSessionSettingsModalVisible: false,
    isEditCollectionModalVisible: false,
    isDuplicateCollectionModalVisible: false,
    isCollectionPreviewModalVisible: false,
    isNextButtonVisible: false,
  });

  // Tour state management
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Generate tour steps based on visibility states
  const steps = tourStepsYourCollections(visibilityStates);

  const handleTourComplete = () => {
    setIsTourRunning(false);
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  // Ensure the tour only starts when triggered from the Navbar
  useEffect(() => {
    // You can add any logic here if needed to check if the tour should start
  }, []);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log("Fetching user collections...");
        const fetchedCollections = await fetchCollections(
          getAccessTokenSilently,
        );
        console.log("Collections loaded:", fetchedCollections.length);
        if (Array.isArray(fetchedCollections)) {
          setCollections(
            fetchedCollections.filter(
              (collection) => collection.collection_id != null,
            ),
          );
          filterAndSortCollections(
            fetchedCollections,
            selectedCategory,
            sortOption,
          );
          // Update visibility states based on the fetched collections
          setVisibilityStates((prev) => ({
            ...prev,
            isCollectionCardVisible: fetchedCollections.length > 0,
          }));
        } else {
          console.error("Unexpected data format:", fetchedCollections);
        }
      } catch (error) {
        console.error("Error loading collections. Please try again later.");
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
        }
      }
    };

    loadCollections();
  }, [selectedCategory, sortOption, getAccessTokenSilently]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setEditModalOpen(false);
      }
    };

    if (isEditModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditModalOpen]);

  const filterAndSortCollections = (
    collections: Collection[],
    category: string,
    sortOption: string,
  ) => {
    let filtered = collections;

    if (category !== "All Collections") {
      filtered = collections.filter(
        (collection) => collection.category === category,
      );
    }

    if (sortOption === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (sortOption === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    }
    // No sorting for "custom", maintain the order based on drag-and-drop

    setFilteredCollections(filtered);
  };

  const handleSaveUpdatedItems = async (
    newItems: { name: string; id?: number }[],
    newCollectionName: string,
    isPublic: boolean,
  ) => {
    setIsLoading(true);
    try {
      if (selectedCollection) {
        const filteredItems = newItems
          .filter((item) => String(item.name).trim() !== "")
          .map((item) => ({
            name: String(item.name),
            id: item.id,
          }));

        const updatedDescription = JSON.stringify(filteredItems);

        const updatedCollection = await updateCollection(
          selectedCollection.collection_id,
          newCollectionName,
          updatedDescription,
          selectedCollection.category,
          isPublic,
          getAccessTokenSilently,
        );

        // Update both collections and filteredCollections
        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.collection_id === selectedCollection.collection_id
              ? updatedCollection
              : col,
          ),
        );

        // Update filteredCollections as well
        setFilteredCollections((prevFiltered) =>
          prevFiltered.map((col) =>
            col.collection_id === selectedCollection.collection_id
              ? updatedCollection
              : col,
          ),
        );

        setSelectedCollection(updatedCollection);
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCollection = (collectionId: number) => {
    const collection = collections.find(
      (col) => col.collection_id === collectionId,
    );
    if (collection) {
      setSelectedCollection(collection);
      setShowModal(true);
    }
  };

  const handleEditButtonClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditModalOpen(true);
  };

  const handleDuplicateConfirm = async (collection: Collection) => {
    try {
      setIsLoading(true);
      await duplicateCollection(collection, getAccessTokenSilently);

      const refreshedCollections = await fetchCollections(getAccessTokenSilently);
      setCollections(refreshedCollections);
      filterAndSortCollections(refreshedCollections, selectedCategory, sortOption);
    } catch (error) {
      console.error("Error duplicating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollectionById(collectionId, getAccessTokenSilently);
      const updatedCollections = collections.filter(
        (collection) => collection.collection_id !== collectionId,
      );
      setCollections(updatedCollections);
      filterAndSortCollections(
        updatedCollections,
        selectedCategory,
        sortOption,
      );
      // Update visibility states based on the updated collections
      setVisibilityStates((prev) => ({
        ...prev,
        isCollectionCardVisible: updatedCollections.length > 0,
      }));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleStartSession = (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string,
    answerDisplayTime: number,
    stopCondition: string,
    timerMinutes: number,
    timerSeconds: number,
  ) => {
    if (selectedCollection) {
      // Save the last used time settings
      localStorage.setItem("lastUsedMinutes", min.toString());
      localStorage.setItem("lastUsedSeconds", sec.toString());
      localStorage.setItem("lastUsedSpeed", speed.toString());

      const sequenceItems = JSON.parse(selectedCollection.description || "[]");
      const sequence = sequenceItems.map(
        (
          item: { name: string; svg?: string; count?: number } | string,
          index: number,
        ) => ({
          name: typeof item === "object" ? item.name : item,
          svg: typeof item === "object" ? item.svg : undefined,
          count: typeof item === "object" ? item.count : undefined,
          isAnswer:
            selectedCollection.type === "mathProblems" && index % 2 !== 0,
        }),
      );

      navigate("/fullscreen-display", {
        state: {
          sequence,
          speed,
          shuffle,
          category: selectedCollection.category,
          type: selectedCollection.type,
          answerDisplayTime,
          stopCondition,
          timerMinutes,
          timerSeconds,
        },
      });
      setShowModal(false);

      // Update completion count for the selected collection
      updateCompletionCount(selectedCollection.collection_id);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
      timeZone: "America/Denver",
    }).format(date);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || sortOption !== "custom") {
      return;
    }

    const { source, destination } = result;

    const newFilteredCollections = Array.from(filteredCollections);
    const [movedItem] = newFilteredCollections.splice(source.index, 1);
    newFilteredCollections.splice(destination.index, 0, movedItem);

    setFilteredCollections(newFilteredCollections);

    setCollections((prevCollections) => {
      const collectionOrder = new Map(
        newFilteredCollections.map((col) => [col.collection_id, col]),
      );

      return prevCollections.map(
        (col) => collectionOrder.get(col.collection_id) || col,
      );
    });

    if (window.savePreferenceTimeout) {
      clearTimeout(window.savePreferenceTimeout);
    }
    window.savePreferenceTimeout = setTimeout(() => {
      localStorage.setItem("sortPreference", "custom");
      window.savePreferenceTimeout = null;
    }, 500);
  };

  const adjustColorForTheme = useCallback(
    (color: string) => {
      return adjustColorForColorblindness(color);
    },
    [adjustColorForColorblindness],
  );

  useEffect(() => {
    setVisibilityStates((prevState) => ({
      ...prevState, // Preserve existing values
      isCollectionCardVisible: collections.length > 0,
      isStartCollectionButtonVisible: collections.length > 0,
      isEditCollectionButtonVisible: collections.length > 0,
      isDeleteCollectionButtonVisible: collections.length > 0,
      isSessionSettingsModalVisible: showModal,
      isEditCollectionModalVisible: isEditModalOpen,
    }));
  }, [collections, showModal, isEditModalOpen]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    localStorage.setItem("sortPreference", newSortOption);
    filterAndSortCollections(collections, selectedCategory, newSortOption);
  };

  return (
    <div className="your-collections-page page-container page-container-with-collections mt-6">
      <div className="mb-4 flex items-center justify-between space-x-4">
        {/* Categories Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 rounded border border-black px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            <span>{selectedCategory || "Categories"}</span>
            <span className="ml-2">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                    filterAndSortCollections(collections, category, sortOption);
                  }}
                  className={`w-full px-4 py-2 text-left text-lg transition-colors duration-300 hover:bg-gray-100 ${
                    selectedCategory === category
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort by Dropdown */}
        <select
          aria-label="Sort collections"
          id="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          className="rounded border p-2"
        >
          <option value="date">Sort by Date</option>
          <option value="alphabetical">Sort Alphabetically</option>
          <option value="category">Sort by Category</option>
          <option value="custom">Custom Order</option>
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="collections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid-container w-full"
            >
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  onClick={() => navigate("/new-collection")}
                  className="collection-card flex min-w-[375px] cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300 p-4 transition-all duration-300 hover:border-blue-500 hover:bg-gray-50"
                >
                  <div className="mb-4 rounded-full border border-black bg-green-500 p-4">
                    <svg
                      className="size-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">
                    Create New Collection
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Click to add a new collection
                  </p>
                </div>

                {filteredCollections.map((collection, index) =>
                  sortOption === "custom" ? (
                    <Draggable
                      key={collection.collection_id}
                      draggableId={collection.collection_id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="collection-card min-w-[375px] rounded-lg border-4 border-white p-4 shadow-lg"
                          style={{
                            backgroundColor: "white",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <CollectionContent
                            collection={collection}
                            baseColor={adjustColorForTheme(
                              collectionColorSchemes[
                                index % collectionColorSchemes.length
                              ].backgroundColor,
                            )}
                            handleStartCollection={handleStartCollection}
                            handleEditButtonClick={handleEditButtonClick}
                            handleDeleteCollection={handleDeleteCollection}
                            handleDuplicateConfirm={handleDuplicateConfirm}
                            formatDate={formatDate}
                            completionCount={0}
                            theme={theme}
                          />
                        </div>
                      )}
                    </Draggable>
                  ) : (
                    <div
                      key={collection.collection_id}
                      className="collection-card min-w-[375px] rounded-lg border-4 border-white p-4 shadow-lg"
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      <CollectionContent
                        collection={collection}
                        baseColor={adjustColorForTheme(
                          collectionColorSchemes[
                            index % collectionColorSchemes.length
                          ].backgroundColor,
                        )}
                        handleStartCollection={handleStartCollection}
                        handleEditButtonClick={handleEditButtonClick}
                        handleDeleteCollection={handleDeleteCollection}
                        handleDuplicateConfirm={handleDuplicateConfirm}
                        formatDate={formatDate}
                        completionCount={0}
                        theme={theme}
                      />
                    </div>
                  ),
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showModal && selectedCollection && (
        <SessionSettingsModal
          collectionName={selectedCollection.name}
          onClose={() => setShowModal(false)}
          onStart={handleStartSession}
          currentSettings={{
            speed: parseInt(localStorage.getItem("lastUsedSpeed") || "500"),
            textColor: "#000000",
          }}
          category={selectedCollection.category}
          type={selectedCollection.type || "mathProblems"}
        />
      )}
      {isEditModalOpen && selectedCollection && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          collectionName={selectedCollection.name}
          items={parseDescription(selectedCollection.description)}
          onSave={handleSaveUpdatedItems}
          type={selectedCollection.type}
          isPublic={selectedCollection.status === "public"}
        />
      )}
      {isLoading && <div>Loading...</div>}

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="yourCollections"
      />

    </div>
  );
};

interface CollectionContentProps {
  collection: Collection;
  baseColor: string;
  handleStartCollection: (id: number) => void;
  handleEditButtonClick: (collection: Collection) => void;
  handleDeleteCollection: (id: number) => void;
  handleDuplicateConfirm: (collection: Collection) => void;
  formatDate: (dateString: string) => string;
  completionCount: number;
  theme: {
    isDarkMode: boolean;
    backgroundColor: string;
    textColor: string;
    originalTextColor: string;
  };
}

const CollectionContent: React.FC<CollectionContentProps> = ({
  collection,
  baseColor,
  handleStartCollection,
  handleEditButtonClick,
  handleDeleteCollection,
  handleDuplicateConfirm,
  formatDate,
  theme,
}) => {
  const itemCount = getItemsCount(collection.description);

  const getCategoryColor = (category: string) => {
    const color = categoryColors[category as keyof typeof categoryColors];
    return color || "bg-gray-500";
  };

  const ensureValidColor = (color: string) => {
    return color && color.startsWith("#") ? color : "#FFFFFF";
  };

  const getLightenedBackgroundColor = () => {
    const validBaseColor = ensureValidColor(baseColor);
    const lightened = lightenColor(validBaseColor, 0.7);
    return lightened;
  };

  const headerColor = ensureValidColor(baseColor);
  const contentColor = getLightenedBackgroundColor();

  return (
    <div className="flex size-full flex-col">
      <h1
        className="border-5 w-full rounded-t-lg border-b-0 border-black p-2.5 text-center text-xl font-bold text-black"
        style={{ 
          backgroundColor: headerColor,
          transition: "background-color 0.3s ease"
        }}
      >
        {collection.name}
      </h1>
      <div
        className="border-5 flex size-full flex-col rounded-b-lg border-black"
        style={{
          backgroundColor: contentColor,
          transition: "background-color 0.3s ease"
        }}
      >
        {/* Content wrapper with padding */}
        <div className="flex size-full flex-col p-4">
          {/* Info section - added text-center to center all text */}
          <div className="mb-auto text-center">
            <p className="mb-1 text-base font-bold text-black">
              {itemCount} {itemCount === 1 ? "item" : "items"} in collection
            </p>
            <p
              className={`mb-1 text-sm ${theme.isDarkMode ? "text-white" : "text-black"}`}
            >
              Category:{" "}
              <span
                className={`ml-2 inline-block rounded-full border border-black px-3 py-1 text-white ${getCategoryColor(collection.category)}`}
              >
                {collection.category}
              </span>
            </p>
            <p className="mb-2.5 text-base font-bold text-black">
              Created by you on {formatDate(collection.created_at)}
            </p>
          </div>

          {/* Buttons section */}
          <div className="mt-auto pt-4">
            <div className="mb-2.5 flex justify-center">
              <button
                type="button"
                className="start-collection-button w-2/3 cursor-pointer rounded-lg border-4 border-black bg-green-600 p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95"
                onClick={() => handleStartCollection(collection.collection_id)}
              >
                Start
              </button>
            </div>
            <div className="flex w-full justify-between space-x-4">
              <button
                type="button"
                className="edit-collection-button flex-1 cursor-pointer rounded-lg border-4 border-black bg-yellow-400 p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95"
                onClick={() => handleEditButtonClick(collection)}
              >
                Edit
              </button>
              <button
                type="button"
                className="duplicate-collection-button flex-1 cursor-pointer rounded-lg border-4 border-black bg-blue-500 p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95"
                onClick={() => handleDuplicateConfirm(collection)}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="delete-collection-button flex-1 cursor-pointer rounded-lg border-4 border-black bg-red-600 p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95"
                onClick={() => handleDeleteCollection(collection.collection_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourCollections;
