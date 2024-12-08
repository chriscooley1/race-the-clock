import React, { useState, useEffect } from "react";
import GuidedTour from "../../components/GuidedTour";
import { tourStepsMultipleWords } from "./tourStepsMultipleWords";
import { useTour } from "../../context/TourContext";
import { useNavigate } from "react-router-dom";
import BubbleText from "../../components/BubbleText";

const MultipleWordsGame: React.FC = () => {
  const { isGuidedTourEnabled } = useTour();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [connections, setConnections] = useState<{ [key: string]: string }>({});
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
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
    <div className="page-container">
      <button
        type="button"
        onClick={handleBack}
        className="fixed left-4 z-40 mt-[20px] rounded border border-black bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Back to Games
      </button>
      <h1 className="mb-8 text-3xl font-bold">
        <BubbleText>Multiple Words Game</BubbleText>
      </h1>
      {!isGameStarted ? (
        <div className="game-instructions">
          <p>Drag and connect words to their corresponding cards!</p>
          <button
            type="button"
            onClick={startGame}
            className="start-button bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-black p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
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
