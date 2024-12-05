import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsNewCollection } from "./tourStepsNewCollection";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("Math");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const categories = [
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  // Initialize visibilityStates with all properties
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isCollectionNameVisible: true,
    isCategorySelectVisible: true,
    isStageSelectVisible: true,
    isPublicCheckboxVisible: true,
    isSubmitButtonVisible: true,
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
    isStartCollectionButtonVisible: false,
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
    isCollectionCardVisible: false,
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

  // Define the steps variable
  const steps = tourStepsNewCollection(visibilityStates); // Create tour steps based on visibility states

  // Add a function to start the tour
  const startTour = () => {
    const tourCompleted = localStorage.getItem("newCollectionTourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  // Start the tour when the component mounts
  useEffect(() => {
    startTour(); // Call the startTour function
  }, []);

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    console.log("Navigating to collection setup");
    navigate("/collection-setup", {
      state: { collectionName: name, isPublic, category },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false);
    localStorage.setItem("newCollectionTourCompleted", "true"); // Store completion state specifically for this tour
  };

  // Example of updating visibility states based on some condition
  useEffect(() => {
    // For example, you might want to show the public checkbox only if a certain condition is met
    setVisibilityStates((prev) => ({
      ...prev,
      isPublicCheckboxVisible: true, // Update based on your logic
    }));
  }, []); // Add dependencies as needed

  return (
    <div className="page-container mt-4">
      <div className="mx-auto flex max-w-[600px] flex-col items-center">
        <h1 className="new-collection-page text-4xl font-bold">
          Step 1 - Create
        </h1>
        <h1 className="text-3xl font-bold">New Collection</h1>

        {visibilityStates.isCollectionNameVisible && (
          <div className="mb-4 max-w-[300px] border border-black">
            <input
              type="text"
              id="collectionName"
              className={`collection-name-input font-teacher rounded border border-[var(--text-color)] p-2 text-center text-base ${theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection Name"
              title="Collection Name"
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {visibilityStates.isCategorySelectVisible && (
          <div className="mb-4 flex max-w-[300px] items-center justify-center">
            <label htmlFor="categorySelect" className="mr-2">
              Category:
            </label>
            <select
              id="categorySelect"
              className={`font-teacher w-full rounded border border-black p-2 text-center text-base ${theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {visibilityStates.isPublicCheckboxVisible && (
          <div className="mt-2.5 flex items-center text-sm">
            <input
              type="checkbox"
              id="publicCheckbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              title="Share collection publicly"
              className={`relative mr-2.5 size-5 cursor-pointer appearance-none rounded border-2 ${theme.isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"} checked:bg-blue-500 checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-sm checked:after:text-white checked:after:content-["✓"]`}
            />
            <label htmlFor="publicCheckbox">
              I want to share my collection publicly
            </label>
          </div>
        )}

        {visibilityStates.isSubmitButtonVisible && (
          <button
            type="button"
            onClick={handleNext}
            className="submit-collection-button bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-black p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Next
          </button>
        )}

        {/* Add the GuidedTour component here */}
        <GuidedTour
          steps={steps}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={handleTourStepChange}
          tourName="newCollection"
        />
      </div>
    </div>
  );
};

export default NewCollection;
