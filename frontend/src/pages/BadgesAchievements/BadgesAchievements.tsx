import React, { useEffect, useState } from "react";
import { tourStepsBadgesAchievements } from "./tourStepsBadgesAchievements";
import GuidedTour from "../../components/GuidedTour";
import { useCompletion } from "../../context/CompletionContext";
import BubbleText from "../../components/BubbleText";
import { useTheme } from "../../context/ThemeContext";

const BadgesAchievements: React.FC = () => {
  const [badges, setBadges] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const { completionCounts } = useCompletion();
  const { theme } = useTheme();

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" || theme.isDarkMode
      ? "text-white"
      : "text-black";
  };

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Define achievements
      setAchievements([
        "Read 30 letters in a minute",
        "Read 40 letters in a minute",
        "Read 50 letters in a minute",
        "Read 60 letters in a minute",
        "Match 10 items",
        "Match 20 items",
        "Match 30 items",
        "Match 40 items",
        "Complete an Advanced Session",
        "First Login",
        "Completed 5 Sessions",
        "Explored All Games",
        "Created 3 Collections",
        "Shared a Collection",
        "Achieved 100% on a Quiz",
        "Participated in a Timed Challenge",
        "Logged in for 7 consecutive days",
      ]);

      // Define badges corresponding to achievements
      setBadges([
        "Bronze Badge for reading 30 letters in a minute",
        "Silver Badge for reading 40 letters in a minute",
        "Gold Badge for reading 50 letters in a minute",
        "Platinum Badge for reading 60 letters in a minute",
        "Bronze Badge for matching 10 items",
        "Silver Badge for matching 20 items",
        "Gold Badge for matching 30 items",
        "Platinum Badge for matching 40 items",
        "Master of the Advanced for completing an advanced session",
        "Welcome Aboard Badge for first login",
        "Session Slayer Medal for completing 5 sessions",
        "Explorer of Worlds Badge for exploring all games",
        "Collection Connoisseur Trophy for creating 3 collections",
        "Sharing is Caring Badge for sharing a collection",
        "Quiz Whiz Trophy for achieving 100% on a quiz",
        "Challenge Accepted Badge for participating in a timed challenge",
        "Loyalty Badge for logging in for 7 consecutive days",
      ]);
    };

    loadData();
  }, []);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(
      `tourCompleted_badgesAchievements`,
    );
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem(`tourCompleted_badgesAchievements`, "true");
  };

  // Call the function without arguments
  const steps = tourStepsBadgesAchievements();

  return (
    <div className={`page-container ${getTextColorClass(theme.backgroundColor)}`}>
      <h1 className="mb-8 text-3xl font-bold inherit">
        <BubbleText>Badges & Achievements</BubbleText>
      </h1>
      <p className="inherit">
        Badges and Achievements: Create badges for students who achieve specific
        goals, like "Read 60 Letters in a Minute" or "Complete an Advanced
        Session."
      </p>
      <p className="inherit">
        Milestones for Teachers: Teachers can set milestones for their students,
        rewarding them as they improve, fostering motivation.
      </p>

      <div className="mt-8 w-full max-w-2xl">
        <div className="badges-section">
          <h2 className="text-2xl font-semibold inherit">Badges</h2>
          <ul className="list-disc pl-5 inherit">
            {badges.length > 0 ? (
              badges.map((badge, index) => <li key={index}>{badge}</li>)
            ) : (
              <li>No badges available.</li>
            )}
          </ul>
        </div>

        <div className="achievements-section mt-8">
          <h2 className="text-2xl font-semibold inherit">Achievements</h2>
          <ul className="list-disc pl-5 inherit">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))
            ) : (
              <li>No achievements available.</li>
            )}
          </ul>
        </div>

        <h2 className="text-2xl font-semibold inherit">Completion Counts</h2>
        <ul className="inherit">
          {Object.entries(completionCounts).length > 0 ? (
            Object.entries(completionCounts).map(([collectionId, count]) => (
              <li key={collectionId}>
                Collection ID {collectionId}: Completed {count} times
              </li>
            ))
          ) : (
            <li>No completion counts available.</li>
          )}
        </ul>
      </div>

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
