import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsBadgesAchievements } from "./tourStepsBadgesAchievements";
import GuidedTour from "../../components/GuidedTour";
import { useCompletion } from "../../context/CompletionContext";
import FeedbackForm from "../../components/FeedbackForm";

const BadgesAchievements: React.FC = () => {
  const { theme } = useTheme();
  const [badges, setBadges] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const { completionCounts } = useCompletion();

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
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true); // Start the tour if not completed
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  // Call the function without arguments
  const steps = tourStepsBadgesAchievements();

  return (
    <div
      className={`badges-achievements flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } mt-4`}
      style={{ color: theme.originalTextColor }}
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

      <div className="mt-8 w-full max-w-2xl">
        <div className="badges-section">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <ul className="list-disc pl-5">
            {badges.length > 0 ? (
              badges.map((badge, index) => <li key={index}>{badge}</li>)
            ) : (
              <li>No badges available.</li>
            )}
          </ul>
        </div>

        <div className="achievements-section mt-8">
          <h2 className="text-2xl font-semibold">Achievements</h2>
          <ul className="list-disc pl-5">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))
            ) : (
              <li>No achievements available.</li>
            )}
          </ul>
        </div>

        <h2 className="text-2xl font-semibold">Completion Counts</h2>
        <ul>
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

      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Give Feedback
      </button>

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}

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
