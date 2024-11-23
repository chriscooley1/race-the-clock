import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import FeedbackForm from "../../components/FeedbackForm";
import GuidedTour from "../../components/GuidedTour";
import { tourStepsMultipleWords } from "./tourStepsMultipleWords";
import { useTour } from "../../context/TourContext";
import { useNavigate } from "react-router-dom";

const MultipleWordsGame: React.FC = () => {
  const { theme } = useTheme();
  const { isGuidedTourEnabled } = useTour();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [connections, setConnections] = useState<{ [key: string]: string }>({});
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const navigate = useNavigate();

  const words = ["Word1", "Word2", "Word3"];
  const images = ["Image1", "Image2", "Image3"];

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted_multipleWords");
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted_multipleWords", "true");
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const handleConnect = (word: string, image: string) => {
    setConnections((prev) => ({ ...prev, [word]: image }));
  };

  const handleBack = () => {
    navigate("/games");
  };

  return (
    <div
      className="multiple-words-container mt-[70px] flex flex-col items-center"
      style={{ color: theme.originalTextColor }}
    >
      <button
        type="button"
        onClick={handleBack}
        className="fixed left-[270px] top-20 z-40 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 md:left-[270px]"
      >
        Back to Games
      </button>
      <h1 className="text-3xl font-bold">Multiple Words Game</h1>
      {!isGameStarted ? (
        <div className="game-instructions">
          <p>Drag and connect words to their corresponding cards!</p>
          <button
            type="button"
            onClick={startGame}
            className="start-button mt-4 rounded bg-blue-500 p-2 text-white"
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
                  onClick={() => handleConnect(word, "Image1")}
                  className="m-2 cursor-pointer"
                >
                  {word} {connections[word] && `→ ${connections[word]}`}
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
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
      <GuidedTour
        steps={tourStepsMultipleWords()}
        isRunning={isTourRunning && isGuidedTourEnabled}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="multipleWords"
      />
    </div>
  );
};

export default MultipleWordsGame;
