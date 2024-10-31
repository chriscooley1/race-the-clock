import React, { useState } from "react";

const MultipleWordsGame: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const startGame = () => {
    setIsGameStarted(true);
    // Additional logic to initialize the game can be added here
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
        <p>Game is starting... (Add game logic here)</p>
      )}
    </div>
  );
};

export default MultipleWordsGame;
