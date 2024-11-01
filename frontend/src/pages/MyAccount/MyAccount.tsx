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
  const [isProfileVisible, setIsProfileVisible] = useState(true);

  // Simplify the visibility states to only what's needed
  const [visibilityStates] = useState<VisibilityStates>({
    isProfileVisible: true,
    isUpdateFormVisible: true,
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
    // ... other states can be false by default
  });

  // Remove the shouldStartTour state as it's not needed
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define steps outside of render to prevent recreation
  const steps = tourStepsMyAccount(visibilityStates);
  console.log("Tour Steps:", steps); // Debugging line

  const [isTourVisible, setIsTourVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        setUserData(userProfile);
        // Start the tour after user data is fetched
        startTour(); // Call startTour here if needed
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    setCurrentTourStep(0); // Reset step counter when tour completes
  };

  const handleTourStepChange = (step: number) => {
    console.log("Changing to step:", step); // Add debugging
    setCurrentTourStep(step);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const startTour = () => {
    setIsTourVisible(true);
    setCurrentTourStep(0); // Reset step counter
    setIsTourRunning(true);
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center px-4 py-8 ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"} my-account`}
    >
      <div
        className={`w-full max-w-md rounded-lg p-16 shadow-md ${theme.isDarkMode ? "bg-gray-700" : "bg-white"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Account</h1>
          <button onClick={startTour} className="text-blue-500 hover:text-blue-600">
            Start Tour
          </button>
        </div>
        {user ? (
          <div className="space-y-4">
            <div className="user-profile flex flex-col items-center">
              {isProfileVisible && (
                <>
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
                </>
              )}
              <button
                type="button"
                onClick={toggleProfileVisibility}
                className="mt-2 text-blue-500"
              >
                {isProfileVisible ? 'Hide Profile' : 'Show Profile'}
              </button>
            </div>
            <UpdateDisplayNameForm className="update-display-name-form" />
          </div>
        ) : (
          <p className="text-center">Loading user information...</p>
        )}
      </div>
      {isTourVisible && (
        <GuidedTour
          steps={steps}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={handleTourStepChange}
          tourName="myAccount"
        />
      )}
    </div>
  );
};

export default MyAccount;
