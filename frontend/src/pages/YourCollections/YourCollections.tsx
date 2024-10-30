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
import CollectionsNavBar from "../../components/CollectionsNavBar";
import EditCollectionModal from "../../components/EditCollectionModal";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { collectionColorSchemes } from "../../constants/colorSchemes";
import { lightenColor } from "../../utils/colorUtils";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsYourCollections } from "./tourStepsYourCollections";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";
import { useTour } from "../../context/TourContext";

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: string;
  user_id: number;
  creator_username: string;
  items: Item[];
  type: string;
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
  const [isDuplicateModalOpen, setDuplicateModalOpen] =
    useState<boolean>(false);
  const [selectedCollectionToDuplicate, setSelectedCollectionToDuplicate] =
    useState<number | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { theme, adjustColorForColorblindness } = useTheme();
  const { startTour } = useTour();

  // Visibility states for the tour
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
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
    isNextButtonVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isBadgesSectionVisible: false,
    isAchievementsSectionVisible: false,
    isLoadingMessageVisible: false,
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isPreviousButtonVisible: false,
    isProgressIndicatorVisible: false,
    isPauseButtonVisible: false,
    isScreenClickAreaVisible: false,
    isMatchingGameVisible: false,
    isMultipleWordsGameVisible: false,
    isRegisterButtonVisible: false,
    isLoginButtonVisible: false,
    isProfileVisible: false,
    isUpdateFormVisible: false,
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isReportsOverviewVisible: false,
    isReportsListVisible: false,
    isFAQSectionVisible: false,
    isInstructionalVideosVisible: false,
    isTimedChallengesVisible: false,
    isCollectionsOverviewVisible: false,
    isCollectionCardVisible: true,
    isStartCollectionButtonVisible: true,
    isEditCollectionButtonVisible: true,
    isDeleteCollectionButtonVisible: true,
    isMainFontVisible: false,
    isHeadingFontVisible: false,
    isButtonFontVisible: false,
    isColorThemeVisible: false,
    isTextColorVisible: false,
    isBackgroundColorVisible: false,
    isAccessibilityVisible: false,
    isBackgroundThemeVisible: false,
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

  const handleTourStart = () => {
    setIsTourRunning(true);
    startTour(steps);
  };

  useEffect(() => {
    // Start the tour when the component mounts
    handleTourStart();
  }, []);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log("Fetching user collections...");
        const fetchedCollections = await fetchCollections(
          getAccessTokenSilently,
        );
        console.log("Loaded collections:", fetchedCollections);
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
        console.error("Error loading collections:", error);
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
        setDuplicateModalOpen(false);
      }
    };

    if (isDuplicateModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDuplicateModalOpen]);

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
          newCollectionName, // Use the new collection name here
          updatedDescription,
          selectedCollection.category,
          getAccessTokenSilently,
        );

        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.collection_id === updatedCollection.collection_id
              ? updatedCollection
              : col,
          ),
        );
        setSelectedCollection(updatedCollection);

        const refreshedCollections = await fetchCollections(
          getAccessTokenSilently,
        );
        setCollections(refreshedCollections);
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

  const handleDuplicateCollection = () => {
    setDuplicateModalOpen(true);
  };

  const handleDuplicateConfirm = async () => {
    if (!selectedCollectionToDuplicate) return;
    try {
      const collectionToDuplicate = collections.find(
        (col) => col.collection_id === selectedCollectionToDuplicate,
      );
      if (!collectionToDuplicate) {
        console.error("Selected collection not found");
        return;
      }
      const duplicatedCollection = await duplicateCollection(
        collectionToDuplicate,
        getAccessTokenSilently,
      );
      setCollections((prevCollections) => [
        ...prevCollections,
        duplicatedCollection,
      ]);
      filterAndSortCollections(
        [...collections, duplicatedCollection],
        selectedCategory,
        sortOption,
      );
      setDuplicateModalOpen(false);
    } catch (error) {
      console.error("Error duplicating collection:", error);
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
  ) => {
    if (selectedCollection) {
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
        },
      });
      setShowModal(false);
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    localStorage.setItem("sortPreference", newSortOption);
    filterAndSortCollections(collections, selectedCategory, newSortOption);
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
      // If there's no destination or the sort mode is not "custom", do nothing
      return;
    }

    // Perform reordering in "custom" sort mode
    const updatedCollections = Array.from(filteredCollections);
    const [reorderedItem] = updatedCollections.splice(result.source.index, 1);
    updatedCollections.splice(result.destination.index, 0, reorderedItem);

    // Update state with new order
    setFilteredCollections(updatedCollections);
    setCollections((prevCollections) =>
      prevCollections.map(
        (col) =>
          updatedCollections.find(
            (item) => item.collection_id === col.collection_id,
          ) || col,
      ),
    );

    // Save the "custom" sort preference in localStorage
    setSortOption("custom");
    localStorage.setItem("sortPreference", "custom");
  };

  const adjustColorForTheme = useCallback(
    (color: string) => {
      return adjustColorForColorblindness(color);
    },
    [adjustColorForColorblindness],
  );

  useEffect(() => {
    // Start the tour when the component mounts
    handleTourStart();
  }, []);

  return (
    <div
      className={`min-h-screen w-full px-4 pt-[170px] md:pl-[270px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <CollectionsNavBar
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        onDuplicateCollection={handleDuplicateCollection}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="collections"
          isDropDisabled={sortOption !== "custom"}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="your-collections-page grid max-h-[calc(100vh-170px)] w-full grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCollections.map((collection, index) => {
                const baseColor = adjustColorForTheme(
                  collectionColorSchemes[index % collectionColorSchemes.length]
                    .backgroundColor,
                );
                const lightColor = baseColor
                  ? lightenColor(baseColor, 0.7)
                  : "";

                const isDraggable = sortOption === "custom";

                return isDraggable ? (
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
                        className="border-5 relative flex h-[300px] flex-col items-center justify-start overflow-hidden border-black p-5"
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: lightColor,
                        }}
                      >
                        <CollectionContent
                          collection={collection}
                          baseColor={baseColor}
                          handleStartCollection={handleStartCollection}
                          handleEditButtonClick={handleEditButtonClick}
                          handleDeleteCollection={handleDeleteCollection}
                          formatDate={formatDate}
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div
                    key={collection.collection_id}
                    className="collection-card border-5 relative flex h-[300px] flex-col items-center justify-start overflow-hidden border-black p-5"
                    style={{
                      backgroundColor: lightColor,
                    }}
                  >
                    <CollectionContent
                      collection={collection}
                      baseColor={baseColor}
                      handleStartCollection={handleStartCollection}
                      handleEditButtonClick={handleEditButtonClick}
                      handleDeleteCollection={handleDeleteCollection}
                      formatDate={formatDate}
                    />
                  </div>
                );
              })}
              {provided.placeholder}
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
            speed: 500,
            textColor: "#000000",
          }}
          category={selectedCollection.category}
          type={selectedCollection.type}
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
        />
      )}
      {isDuplicateModalOpen && (
        <div className="fixed left-0 top-0 z-[1001] flex size-full items-center justify-center overflow-hidden bg-black/70">
          <div
            ref={modalRef}
            className="font-caveat relative z-[1002] w-1/4 max-w-[600px] rounded-lg p-5 text-center shadow-lg"
            style={{
              backgroundColor: adjustColorForColorblindness(
                theme.backgroundColor,
              ),
              color: adjustColorForColorblindness(theme.textColor),
            }}
          >
            <h2 className="mb-4 text-2xl font-bold">Duplicate Collection</h2>
            <div className="mb-4">
              <label htmlFor="duplicate-collection-select" className="sr-only">
                Select a collection to duplicate
              </label>
              <select
                id="duplicate-collection-select"
                value={selectedCollectionToDuplicate || ""}
                onChange={(e) =>
                  setSelectedCollectionToDuplicate(Number(e.target.value))
                }
                className="font-caveat w-full rounded border p-2 text-base"
                style={{
                  backgroundColor: adjustColorForColorblindness(
                    theme.backgroundColor,
                  ),
                  color: adjustColorForColorblindness(theme.textColor),
                  borderColor: adjustColorForColorblindness(theme.textColor),
                }}
                aria-label="Select a collection to duplicate"
              >
                <option value="">Select a collection to duplicate</option>
                {collections.map((collection) => (
                  <option
                    key={collection.collection_id}
                    value={collection.collection_id}
                  >
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleDuplicateConfirm}
                className="rounded px-4 py-2 font-bold uppercase transition duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: adjustColorForColorblindness(
                    theme.isDarkMode ? "#4CAF50" : "#45a049",
                  ),
                  color: adjustColorForColorblindness(theme.backgroundColor),
                }}
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => setDuplicateModalOpen(false)}
                className="rounded px-4 py-2 font-bold uppercase transition duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: adjustColorForColorblindness(
                    theme.isDarkMode ? "#f44336" : "#d32f2f",
                  ),
                  color: adjustColorForColorblindness(theme.backgroundColor),
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
  formatDate: (dateString: string) => string;
}

const CollectionContent: React.FC<CollectionContentProps> = ({
  collection,
  baseColor,
  handleStartCollection,
  handleEditButtonClick,
  handleDeleteCollection,
  formatDate,
}) => (
  <>
    <h1
      className="border-5 w-full rounded-t-lg border-b-0 border-black p-2.5 text-center text-xl font-bold text-black"
      style={{ backgroundColor: baseColor }}
    >
      {collection.name}
    </h1>
    <div className="border-5 border-t-5 flex w-full grow flex-col items-center justify-between rounded-b-lg border-black p-4">
      <div>
        <p className="mb-1 text-base font-bold text-black">
          {getItemsCount(collection.description)} items in collection
        </p>
        <p className="mb-2.5 text-base font-bold text-black">
          Created by you on {formatDate(collection.created_at)}
        </p>
      </div>
      <div className="flex flex-col items-center justify-end">
        <button
          type="button"
          className="start-collection-button mb-2.5 w-full cursor-pointer rounded-lg border-none p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95 active:opacity-70"
          style={{ backgroundColor: "green" }}
          onClick={() => handleStartCollection(collection.collection_id)}
        >
          Start
        </button>
        <div className="flex w-full justify-between space-x-4">
          <button
            type="button"
            className="edit-collection-button flex-1 cursor-pointer rounded-lg border-none p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95 active:opacity-70"
            style={{ backgroundColor: "yellow" }}
            onClick={() => handleEditButtonClick(collection)}
          >
            Edit
          </button>
          <button
            type="button"
            className="delete-collection-button flex-1 cursor-pointer rounded-lg border-none p-2 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95 active:opacity-70"
            style={{ backgroundColor: "red" }}
            onClick={() => handleDeleteCollection(collection.collection_id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </>
);

export default YourCollections;
