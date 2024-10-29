import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsGames } from "./tourStepsGames";
import { VisibilityStates } from "../../types/VisibilityStates";
import GuidedTour from "../../components/GuidedTour";

const Games: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Initialize visibilityStates with all properties
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
    isMatchingGameVisible: true,
    isMultipleWordsGameVisible: true,
    isNameInputVisible: false, // Set to false for visibility
    isAddNameButtonVisible: false, // Set to false for visibility
    isSpinButtonVisible: false, // Set to false for visibility
    isNamesListVisible: false, // Set to false for visibility
    isCollectionNameVisible: false, // Set to false for visibility
    isCategorySelectVisible: false, // Set to false for visibility
    isStageSelectVisible: false, // Set to false for visibility
    isPublicCheckboxVisible: false, // Set to false for visibility
    isSubmitButtonVisible: false, // Set to false for visibility
    isReportsOverviewVisible: false, // Set to false for visibility
    isReportsListVisible: false, // Set to false for visibility
    isFAQSectionVisible: false, // Set to false for visibility
    isInstructionalVideosVisible: false, // Set to false for visibility
    isTimedChallengesVisible: false, // Set to false for visibility
    isCollectionsOverviewVisible: false, // Set to false for visibility
    isCollectionCardVisible: false, // Set to false for visibility
    isStartCollectionButtonVisible: false, // Set to false for visibility
    isEditCollectionButtonVisible: false, // Set to false for visibility
    isDeleteCollectionButtonVisible: false, // Set to false for visibility
    isMainFontVisible: false,
    isHeadingFontVisible: false,
    isButtonFontVisible: false,
    isColorThemeVisible: false,
    isTextColorVisible: false,
    isBackgroundColorVisible: false,
    isAccessibilityVisible: false,
    isBackgroundThemeVisible: false,
  });

  useEffect(() => {
    // Simulate loading data or setup
    const loadData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Example of updating visibility states based on some condition
  useEffect(() => {
    // You can set visibility states based on your logic here
    setVisibilityStates((prevStates) => ({
      ...prevStates,
      isMatchingGameVisible: true, // or false based on your logic
      isMultipleWordsGameVisible: true, // or false based on your logic
    }));
  }, []); // This effect runs once when the component mounts

  // Start the tour when the component mounts
  useEffect(() => {
    // Start the tour when the component mounts
    setIsTourRunning(true);
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } games`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>
        Welcome to the Games page! Here are some fun activities to enhance
        engagement.
      </p>

      {isLoading ? (
        <p>Loading games...</p>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="matching-game mt-8">
            <h2 className="text-2xl font-semibold">Matching Game</h2>
            <p>Match the letters with the corresponding images!</p>
            {/* Add your game logic and UI here */}
          </div>

          <div className="multiple-words-game mt-8">
            <h2 className="text-2xl font-semibold">Multiple Words Game</h2>
            <p>Drag and connect words to their corresponding cards!</p>
            {/* Add your game logic and UI here */}
          </div>
        </div>
      )}

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={tourStepsGames(visibilityStates)} // Pass the visibility states to create tour steps
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="games"
      />
    </div>
  );
};

export default Games;
