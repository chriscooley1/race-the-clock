import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import FeedbackForm from "../../components/FeedbackForm";

const MultipleWordsGame: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [connections, setConnections] = useState<{ [key: string]: string }>({}); // Track connections
  const words = ["Word1", "Word2", "Word3"]; // Example words
  const images = ["Image1", "Image2", "Image3"]; // Example images
  const { theme } = useTheme(); // Get the theme context
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

  const startGame = () => {
    setIsGameStarted(true);
    // Initialize connections or game state here
  };

  const handleConnect = (word: string, image: string) => {
    setConnections((prev) => ({ ...prev, [word]: image })); // Update connection state
  };

  return (
    <div
      className="mt-[70px] flex flex-col items-center"
      style={{ color: theme.originalTextColor }}
    >
      <h1 className="text-3xl font-bold">Multiple Words Game</h1>
      {!isGameStarted ? (
        <div>
          <p>Drag and connect words to their corresponding cards!</p>
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
                onClick={() => handleConnect(word, "Image1")}
                className="m-2 cursor-pointer"
              >
                {word} {connections[word] && `→ ${connections[word]}`}{" "}
                {/* Show connection status */}
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
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="bg-light-blue mt-4 rounded px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}{" "}
      {/* Render FeedbackForm */}
    </div>
  );
};

export default MultipleWordsGame;
