import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { VisibilityStates } from "../../types/VisibilityStates";
import { tourStepsBadgesAchievements } from "./tourStepsBadgesAchievements";
import GuidedTour from "../../components/GuidedTour";

const BadgesAchievements: React.FC = () => {
  const { theme } = useTheme();
  const [badges, setBadges] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

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
    isBadgesSectionVisible: true,
    isAchievementsSectionVisible: true,
    isLoadingMessageVisible: true,
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

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBadges([
        "Read 60 Letters in a Minute",
        "Complete an Advanced Session",
      ]);
      setAchievements(["First Login", "Completed 5 Sessions"]);
      setIsLoading(false);
      setVisibilityStates((prev) => ({
        ...prev,
        isLoadingMessageVisible: false,
        isMainFontVisible: false,
        isHeadingFontVisible: false,
        isButtonFontVisible: false,
        isColorThemeVisible: false,
        isTextColorVisible: false,
        isBackgroundColorVisible: false,
        isAccessibilityVisible: false,
        isBackgroundThemeVisible: false,
      }));
    };

    loadData();
  }, []);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true); // Start the tour if not completed
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  const steps = tourStepsBadgesAchievements(visibilityStates);

  return (
    <div
      className={`badges-achievements flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Badges & Achievements</h1>
      <p>
        Badges and Achievements: Create badges for students who achieve specific
        goals, like "Read 60 Letters in a Minute" or "Complete an Advanced
        Session."
      </p>
      <p>
        Milestones for Teachers: Teachers can set milestones for their students,
        rewarding them as they improve, fostering motivation.
      </p>

      {isLoading ? (
        <p className="loading-message">Loading badges and achievements...</p>
      ) : (
        <div className="mt-8 w-full max-w-2xl">
          {visibilityStates.isBadgesSectionVisible && (
            <div className="badges-section">
              <h2 className="text-2xl font-semibold">Badges</h2>
              <ul className="list-disc pl-5">
                {badges.map((badge, index) => (
                  <li key={index}>{badge}</li>
                ))}
              </ul>
            </div>
          )}

          {visibilityStates.isAchievementsSectionVisible && (
            <div className="achievements-section mt-8">
              <h2 className="text-2xl font-semibold">Achievements</h2>
              <ul className="list-disc pl-5">
                {achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="badgesAchievements"
      />
    </div>
  );
};

export default BadgesAchievements;
