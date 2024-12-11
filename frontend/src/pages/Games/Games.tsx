import React, { useEffect, useState } from "react";
import { tourStepsGames } from "./tourStepsGames";
import GuidedTour from "../../components/GuidedTour";
import { Link } from "react-router-dom";
import BubbleText from "../../components/BubbleText";
import { useTheme } from "../../context/ThemeContext";

const Games: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  useEffect(() => {
    // Simulate loading data or setup
    const loadData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
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

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" || theme.isDarkMode
      ? "text-white"
      : "text-black";
  };

  return (
    <div className={`page-container ${getTextColorClass(theme.backgroundColor)}`}>
      <h1 className="mb-8 text-3xl font-bold inherit">
        <BubbleText>Games</BubbleText>
      </h1>
      <p className="inherit">
        Welcome to the Games page! Here are some fun activities to enhance
        engagement.
      </p>
      {isLoading ? (
        <p className="inherit">Loading games...</p>
      ) : (
        <div className="w-full max-w-2xl">
          <Link to="/games/matching-game" className="matching-game mt-8 block hover:opacity-80">
            <h2 className="text-2xl font-semibold inherit">Matching Game</h2>
            <p className="inherit">Match the letters with the corresponding images!</p>
          </Link>

          <Link to="/games/multiple-words-game" className="multiple-words-game mt-8 block hover:opacity-80">
            <h2 className="text-2xl font-semibold inherit">Multiple Words Game</h2>
            <p className="inherit">Drag and connect words to their corresponding cards!</p>
          </Link>

          <Link to="/games/timed-challenges" className="timed-challenges-game mt-8 block hover:opacity-80">
            <h2 className="text-2xl font-semibold inherit">Timed Challenges</h2>
            <p className="inherit">Complete as many challenges as you can within the time limit!</p>
          </Link>
        </div>
      )}
      <GuidedTour
        steps={tourStepsGames()} // Pass the steps without visibility states
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
