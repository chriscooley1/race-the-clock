import React, { useState } from "react";

const MatchingGame: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [matches, setMatches] = useState<{ [key: string]: boolean }>({}); // Track matches
  const words = ["A", "B", "C"]; // Example words
  const images = ["Image1", "Image2", "Image3"]; // Example images

  const startGame = () => {
    setIsGameStarted(true);
    // Initialize matches or game state here
  };

  const handleMatch = (word: string) => {
    setMatches((prev) => ({ ...prev, [word]: true })); // Update match state
  };

  return (
    <div className="flex flex-col items-center mt-[70px]">
      <h1 className="text-3xl font-bold">Matching Game</h1>
      {!isGameStarted ? (
        <div>
          <p>Match the letters with the corresponding images!</p>
          <button type="button" onClick={startGame} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <p>Game is starting...</p>
          <div className="flex">
            {words.map((word) => (
              <div key={word} onClick={() => handleMatch(word)} className="m-2 cursor-pointer">
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
    </div>
  );
};

export default MatchingGame;
