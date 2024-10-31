import React, { useState } from "react";

const MultipleWordsGame: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [connections, setConnections] = useState<{ [key: string]: string }>({}); // Track connections
  const words = ["Word1", "Word2", "Word3"]; // Example words
  const images = ["Image1", "Image2", "Image3"]; // Example images

  const startGame = () => {
    setIsGameStarted(true);
    // Initialize connections or game state here
  };

  const handleConnect = (word: string, image: string) => {
    setConnections((prev) => ({ ...prev, [word]: image })); // Update connection state
  };

  return (
    <div className="flex flex-col items-center mt-[70px]">
      <h1 className="text-3xl font-bold">Multiple Words Game</h1>
      {!isGameStarted ? (
        <div>
          <p>Drag and connect words to their corresponding cards!</p>
          <button type="button" onClick={startGame} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <p>Game is starting...</p>
          <div className="flex">
            {words.map((word) => (
              <div key={word} onClick={() => handleConnect(word, "Image1")} className="m-2 cursor-pointer">
                {word} {connections[word] && `→ ${connections[word]}`} {/* Show connection status */}
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

export default MultipleWordsGame;
