import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCollections, deleteCollectionById, duplicateCollection, updateCollection } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import SessionSettingsModal from "../../components/SessionSettingsModal/SessionSettingsModal";
import CollectionsNavBar from "../../components/CollectionsNavBar/CollectionsNavBar";
import EditCollectionModal from "../../components/EditCollectionModal/EditCollectionModal";
import "./YourCollections.css";
import "../../App.css";
import axios from "axios";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { collectionColorSchemes } from "../../constants/colorSchemes";
import { lightenColor } from "../../utils/colorUtils";

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

const parseDescription = (description: string): { name: string; id?: number }[] => {
  try {
    const parsed = JSON.parse(description);
    return Array.isArray(parsed)
      ? parsed.map((item, index) => ({
          name: typeof item === "object" && item !== null ? item.name : String(item),
          id: typeof item === "object" && item !== null && "id" in item ? item.id : index,
        }))
      : [];
  } catch {
    return [{ name: description }];
  }
};

const YourCollections: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [sortOption, setSortOption] = useState<string>(localStorage.getItem("sortPreference") || "date");
  const [isDuplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);
  const [collectionToDuplicate, setCollectionToDuplicate] = useState<Collection | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log("Fetching user collections...");
        const fetchedCollections = await fetchCollections(getAccessTokenSilently);
        console.log("Loaded collections:", fetchedCollections);
        if (Array.isArray(fetchedCollections)) {
          setCollections(fetchedCollections.filter(collection => collection.collection_id != null));
          filterAndSortCollections(fetchedCollections, selectedCategory, sortOption);
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
    sortOption: string
  ) => {
    let filtered = collections;

    if (category !== "All Collections") {
      filtered = collections.filter((collection) => collection.category === category);
    }

    if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } 
    // No sorting for "custom", maintain the order based on drag-and-drop
  
    setFilteredCollections(filtered);
  };  

  const handleSaveUpdatedItems = async (newItems: { name: string; id?: number }[]) => {
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
          selectedCollection.name,
          updatedDescription,
          selectedCollection.category,
          getAccessTokenSilently
        );

        setCollections((prevCollections) =>
          prevCollections.map((col) => (col.collection_id === updatedCollection.collection_id ? updatedCollection : col))
        );
        setSelectedCollection(updatedCollection);

        const refreshedCollections = await fetchCollections(getAccessTokenSilently);
        setCollections(refreshedCollections);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCollection = (collectionId: number) => {
    const collection = collections.find((col) => col.collection_id === collectionId);
    if (collection) {
      setSelectedCollection(collection);
      setShowModal(true);
    }
  };

  const handleEditButtonClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditModalOpen(true);
  };

  const handleDuplicateCollection = async () => {
    if (!collectionToDuplicate) return;
    try {
      const duplicatedCollection = await duplicateCollection(collectionToDuplicate, getAccessTokenSilently);
      setCollections((prevCollections) => [...prevCollections, duplicatedCollection]);
      filterAndSortCollections([...collections, duplicatedCollection], selectedCategory, sortOption);
      setDuplicateModalOpen(false);
    } catch (error) {
      console.error("Error duplicating collection:", error);
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await deleteCollectionById(collectionId, getAccessTokenSilently);
      const updatedCollections = collections.filter((collection) => collection.collection_id !== collectionId);
      setCollections(updatedCollections);
      filterAndSortCollections(updatedCollections, selectedCategory, sortOption);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleStartSession = (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string
  ) => {
    if (selectedCollection) {
      const sequenceItems = JSON.parse(selectedCollection.description || "[]");
      const sequence = sequenceItems.map((item: { name: string; svg?: string; count?: number } | string, index: number) => ({
        name: typeof item === "object" ? item.name : item,
        svg: typeof item === "object" ? item.svg : undefined,
        count: typeof item === "object" ? item.count : undefined,
        isAnswer: selectedCollection.type === "mathProblems" && index % 2 !== 0,
      }));

      const duration = min * 60 + sec;
      navigate("/fullscreen-display", {
        state: {
          sequence,
          duration,
          speed,
          textColor,
          shuffle,
          category: selectedCollection.category,
          type: selectedCollection.type,
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
      prevCollections.map((col) =>
        updatedCollections.find((item) => item.collection_id === col.collection_id) || col
      )
    );
  
    // Save the "custom" sort preference in localStorage
    setSortOption("custom");
    localStorage.setItem("sortPreference", "custom");
  };  

  return (
    <div className="pl-[250px] pt-[70px] flex flex-col items-center w-full min-h-screen bg-theme-bg text-theme-text dark:bg-gray-800 dark:text-white">
      <CollectionsNavBar 
        onSelectCategory={handleSelectCategory} 
        selectedCategory={selectedCategory}
      />
      
      <div className="flex items-center justify-center w-full mb-5 px-4">
        <div className="flex items-center mr-5">
          <label htmlFor="sort-select" className="mr-2.5">Sort by:</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            className="bg-white text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2.5 text-base font-caveat w-[150px]"
          >
            <option value="date">Date Created</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="category">Category</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <button 
          type="button" 
          className="bg-light-blue text-black dark:bg-blue-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2.5 text-base uppercase font-bold cursor-pointer transition-all duration-300 hover:bg-hover-blue dark:hover:bg-blue-500 hover:scale-105 active:bg-active-blue dark:active:bg-blue-700 active:scale-95"
          onClick={() => setDuplicateModalOpen(true)}
        >
          Duplicate Collection
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="collections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap justify-around p-5 w-full">
              {filteredCollections.map((collection, index) => {
                const baseColor = collectionColorSchemes[index % collectionColorSchemes.length].backgroundColor;
                const lightColor = lightenColor(baseColor, 0.7); // 70% lighter
                return (
                  <Draggable key={collection.collection_id} draggableId={collection.collection_id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex-[0_0_30%] flex flex-col items-center justify-start relative h-[300px] p-5 mb-5 box-border border-5 border-black overflow-hidden" 
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: lightColor
                        }}
                      >
                        {/* Collection content */}
                        <h1 className={`w-full text-black text-center text-xl font-bold p-2.5 border-5 border-black mb-2.5`} style={{backgroundColor: baseColor}}>
                          {collection.name}
                        </h1>
                        <p className="text-black text-base font-bold mb-1">{getItemsCount(collection.description)} items in collection</p>
                        <p className="text-black text-base font-bold mb-2.5">Created by you on {formatDate(collection.created_at)}</p>
                        <button
                          type="button"
                          className="text-black border-none rounded p-2.5 text-base font-bold cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 active:opacity-70 active:scale-95 mb-2.5"
                          style={{backgroundColor: baseColor}}
                          onClick={() => handleStartCollection(collection.collection_id)}
                        >
                          Start
                        </button>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            className="text-black border-none rounded p-2.5 text-base font-bold cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 active:opacity-70 active:scale-95 mr-2.5"
                            style={{backgroundColor: baseColor}}
                            onClick={() => handleEditButtonClick(collection)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-black border-none rounded p-2.5 text-base font-bold cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 active:opacity-70 active:scale-95"
                            style={{backgroundColor: baseColor}}
                            onClick={() => handleDeleteCollection(collection.collection_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
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
        />
      )}
      {isEditModalOpen && selectedCollection && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          collectionName={selectedCollection.name}
          items={parseDescription(selectedCollection.description)}
          onSave={handleSaveUpdatedItems}
        />
      )}
      {isDuplicateModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-[1001] overflow-hidden">
          <div ref={modalRef} className="relative z-[1002] bg-white dark:bg-gray-800 p-5 font-caveat rounded-lg w-1/2 max-w-[600px] shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Duplicate Collection</h2>
            <label htmlFor="duplicate-collection-select" className="block mb-2 dark:text-white">Select a collection to duplicate:</label>
            <select
              id="duplicate-collection-select"
              onChange={(e) => setCollectionToDuplicate(JSON.parse(e.target.value))}
              className="w-full bg-white text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2 text-base font-bold cursor-pointer mb-4"
            >
              <option value="">Select a collection</option>
              {collections.map((collection) => (
                <option key={collection.collection_id} value={JSON.stringify(collection)}>
                  {collection.name}
                </option>
              ))}
            </select>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleDuplicateCollection}
                className="bg-custom-green text-white border-none rounded p-3 text-base font-bold cursor-pointer transition-all duration-300 hover:bg-custom-blue hover:scale-105 active:bg-custom-blue-darker active:scale-95 h-12 inline-block text-center"
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => setDuplicateModalOpen(false)}
                className="bg-custom-red text-white border-none rounded p-3 text-base font-bold cursor-pointer transition-all duration-300 hover:bg-custom-red-dark hover:scale-105 active:bg-custom-red-darker active:scale-95 w-[150px] inline-block text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default YourCollections;