import React, { useState } from "react";
import FeedbackForm from "../../components/FeedbackForm";
import GuidedTour from "../../components/GuidedTour";
import { tourStepsMatchingGame } from "./tourStepsMatchingGame";
import { useTour } from "../../context/TourContext";
import { useNavigate } from "react-router-dom";

const MatchingGame: React.FC = () => {
  const { isGuidedTourEnabled, isTourRunning, setIsTourRunning } = useTour();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [matches, setMatches] = useState<{ [key: string]: boolean }>({});
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const navigate = useNavigate();

  const words = ["A", "B", "C"];
  const images = ["Image1", "Image2", "Image3"];

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted_matchingGame", "true");
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const handleMatch = (word: string) => {
    setMatches((prev) => ({ ...prev, [word]: true }));
  };

  const handleBack = () => {
    navigate("/games");
  };

  return (
    <div className="page-container">
      <button
        type="button"
        onClick={handleBack}
        className="fixed left-4 top-20 z-40 rounded border border-black bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Back to Games
      </button>
      <h1 className="mb-8 text-3xl font-bold">Matching Game</h1>
      {!isGameStarted ? (
        <div className="game-instructions">
          <p>Match the letters with the corresponding images!</p>
          <button
            type="button"
            onClick={startGame}
            className="start-button mt-4 rounded border border-black bg-blue-500 p-2 text-white"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="game-board">
          <p>Game is starting...</p>
          <div className="flex">
            <div className="words-section">
              {words.map((word) => (
                <div
                  key={word}
                  onClick={() => handleMatch(word)}
                  className="m-2 cursor-pointer"
                >
                  {word} {matches[word] && "✓"}
                </div>
              ))}
            </div>
            <div className="cards-section">
              {images.map((image) => (
                <div key={image} className="m-2">
                  {image}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="mt-4 rounded border border-black bg-blue-500 px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
      <GuidedTour
        steps={tourStepsMatchingGame()}
        isRunning={isTourRunning && isGuidedTourEnabled}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="matchingGame"
      />
    </div>
  );
};

export default MatchingGame;
