import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsLandingPage } from "./tourStepsLandingPage";
import { VisibilityStates } from "../../types/VisibilityStates";
import GuidedTour from "../../components/GuidedTour";

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const { theme } = useTheme();

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
    isMatchingGameVisible: false,
    isMultipleWordsGameVisible: false,
    isRegisterButtonVisible: true, // Set to true for visibility
    isLoginButtonVisible: true, // Set to true for visibility
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

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps = tourStepsLandingPage(visibilityStates); // Create tour steps based on visibility states

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
    startTour(); // Call startTour here
  }, []);

  // Example of using setVisibilityStates
  useEffect(() => {
    // Here you can set visibility states based on your logic
    const newVisibilityStates: VisibilityStates = {
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
      isRegisterButtonVisible: true, // or false based on your logic
      isLoginButtonVisible: true, // or false based on your logic
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
    };
    setVisibilityStates(newVisibilityStates);
  }, []); // This effect runs once when the component mounts

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const handleSignup = () => {
    console.log("Signup button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections", isSignup: true } });
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections" } });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center p-5 text-center ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <h1 className="mb-5 box-border text-xl sm:text-2xl md:text-3xl">
        Welcome to Race The Clock
      </h1>
      <div className="w-full max-w-xs">
        {visibilityStates.isRegisterButtonVisible && (
          <button
            type="button"
            onClick={handleSignup}
            className="register-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue mb-2.5 w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
          >
            Register
          </button>
        )}
        {visibilityStates.isLoginButtonVisible && (
          <button
            type="button"
            onClick={handleLogin}
            className="already-registered-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
          >
            Already Registered
          </button>
        )}
      </div>

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="landingPage"
      />
    </div>
  );
};

export default LandingPage;
