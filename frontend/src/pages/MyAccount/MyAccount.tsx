import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser } from "../../api";
import UpdateDisplayNameForm from "../../components/UpdateDisplayNameForm";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsMyAccount } from "./tourStepsMyAccount";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";

interface UserData {
  display_name?: string;
  email?: string;
}

const MyAccount: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
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
    isRegisterButtonVisible: false,
    isLoginButtonVisible: false,
    isProfileVisible: true,
    isUpdateFormVisible: true,
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
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
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
  const steps = tourStepsMyAccount(visibilityStates); // Create tour steps based on visibility states

  const startTour = () => {
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        setUserData(userProfile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    // Start the tour when the component mounts
    startTour(); // Call startTour to use the function
  }, []);

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  // Example of using setVisibilityStates
  const toggleProfileVisibility = () => {
    setVisibilityStates((prev) => ({
      ...prev,
      isProfileVisible: !prev.isProfileVisible,
    }));
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center px-4 py-8 ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <div
        className={`w-full max-w-md rounded-lg p-16 shadow-md ${theme.isDarkMode ? "bg-gray-700" : "bg-white"}`}
      >
        <h1 className="mb-6 text-center text-2xl font-bold">My Account</h1>
        {user ? (
          <div className="space-y-4">
            <div className="user-profile flex flex-col items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="mb-4 size-24 rounded-full"
              />
              <h2 className="text-xl font-semibold">
                {userData?.display_name || user.name}
              </h2>
              <p
                className={`${theme.isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {user.email}
              </p>
              <button
                type="button"
                onClick={toggleProfileVisibility}
                className="mt-2 text-blue-500"
              >
                Toggle Profile Visibility
              </button>
            </div>
            <UpdateDisplayNameForm className="update-display-name-form" />
          </div>
        ) : (
          <p className="text-center">Loading user information...</p>
        )}
      </div>
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="myAccount"
      />
    </div>
  );
};

export default MyAccount;
