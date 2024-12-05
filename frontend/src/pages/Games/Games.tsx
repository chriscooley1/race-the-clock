import React, { useEffect, useState } from "react";
import { tourStepsGames } from "./tourStepsGames";
import GuidedTour from "../../components/GuidedTour";
import { Link } from "react-router-dom";
import FeedbackForm from "../../components/FeedbackForm";
import FeedbackIcon from "../../components/FeedbackIcon";

const Games: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

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

  return (
    <div className="page-container">
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>
        Welcome to the Games page! Here are some fun activities to enhance
        engagement.
      </p>
      {isLoading ? (
        <p>Loading games...</p>
      ) : (
        <div className="w-full max-w-2xl">
          <Link to="/games/matching-game" className="matching-game mt-8">
            <h2 className="text-2xl font-semibold">Matching Game</h2>
            <p>Match the letters with the corresponding images!</p>
          </Link>

          <Link
            to="/games/multiple-words-game"
            className="multiple-words-game mt-8"
          >
            <h2 className="text-2xl font-semibold">Multiple Words Game</h2>
            <p>Drag and connect words to their corresponding cards!</p>
          </Link>

          <Link
            to="/games/timed-challenges"
            className="timed-challenges-game mt-8"
          >
            <h2 className="text-2xl font-semibold">Timed Challenges</h2>
            <p>Complete as many challenges as you can within the time limit!</p>
          </Link>
        </div>
      )}

      <FeedbackIcon onClick={() => setShowFeedback(true)} />

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}{" "}
      {/* Render FeedbackForm */}
      {/* Add the GuidedTour component here */}
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
