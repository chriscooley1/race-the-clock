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
      }));
    };

    loadData();
  }, []);

  const steps = tourStepsBadgesAchievements(visibilityStates);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false);
  };

  useEffect(() => {
    setIsTourRunning(true);
  }, []);

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
