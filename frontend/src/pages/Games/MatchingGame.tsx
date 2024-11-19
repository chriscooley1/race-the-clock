import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import FeedbackForm from "../../components/FeedbackForm";

const MatchingGame: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [matches, setMatches] = useState<{ [key: string]: boolean }>({}); // Track matches
  const words = ["A", "B", "C"]; // Example words
  const images = ["Image1", "Image2", "Image3"]; // Example images
  const { theme } = useTheme(); // Get the theme context
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

  const startGame = () => {
    setIsGameStarted(true);
    // Initialize matches or game state here
  };

  const handleMatch = (word: string) => {
    setMatches((prev) => ({ ...prev, [word]: true })); // Update match state
  };

  return (
    <div className="mt-[70px] flex flex-col items-center" style={{ color: theme.originalTextColor }}>
      <h1 className="text-3xl font-bold">Matching Game</h1>
      {!isGameStarted ? (
        <div>
          <p>Match the letters with the corresponding images!</p>
          <button
            type="button"
            onClick={startGame}
            className="mt-4 rounded bg-blue-500 p-2 text-white"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <p>Game is starting...</p>
          <div className="flex">
            {words.map((word) => (
              <div
                key={word}
                onClick={() => handleMatch(word)}
                className="m-2 cursor-pointer"
              >
                {word} {matches[word] && "✓"} {/* Show match status */}
              </div>
            ))}
            {images.map((image) => (
              <div key={image} className="m-2">
                {image}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Button to show feedback form */}
      <button type="button" onClick={() => setShowFeedback(true)} className="mt-4 bg-light-blue text-white py-2 px-4 rounded">
        Give Feedback
      </button>

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />} {/* Render FeedbackForm */}
    </div>
  );
};

export default MatchingGame;
