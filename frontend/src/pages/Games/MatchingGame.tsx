import React, { useState } from "react";
import GuidedTour from "../../components/GuidedTour";
import { tourStepsMatchingGame } from "./tourStepsMatchingGame";
import { useTour } from "../../context/TourContext";
import { useNavigate } from "react-router-dom";
import BubbleText from "../../components/BubbleText";
import { useTheme } from "../../context/ThemeContext";

const MatchingGame: React.FC = () => {
  const { isGuidedTourEnabled, isTourRunning, setIsTourRunning } = useTour();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [matches, setMatches] = useState<{ [key: string]: boolean }>({});
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const words = ["A", "B", "C"];
  const images = ["Image1", "Image2", "Image3"];

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" || theme.isDarkMode
      ? "text-white"
      : "text-black";
  };

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
    <div className={`page-container ${getTextColorClass(theme.backgroundColor)}`}>
      <button
        type="button"
        onClick={handleBack}
        className="fixed left-4 z-40 mt-[20px] rounded border border-black bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Back to Games
      </button>
      <h1 className="mb-8 text-3xl font-bold inherit">
        <BubbleText>Matching Game</BubbleText>
      </h1>
      {!isGameStarted ? (
        <div className="game-instructions">
          <p className="inherit">Match the letters with the corresponding images!</p>
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
          <p className="inherit">Game is starting...</p>
          <div className="flex">
            <div className="words-section">
              {words.map((word) => (
                <div
                  key={word}
                  onClick={() => handleMatch(word)}
                  className="m-2 cursor-pointer inherit"
                >
                  {word} {matches[word] && "✓"}
                </div>
              ))}
            </div>
            <div className="cards-section">
              {images.map((image) => (
                <div key={image} className="m-2 inherit">
                  {image}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
