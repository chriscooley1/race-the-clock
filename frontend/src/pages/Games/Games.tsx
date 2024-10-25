import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Games: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Simulate loading data or setup
    const loadData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } games`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>
        Welcome to the Games page! Here are some fun activities to enhance engagement.
      </p>

      {isLoading ? (
        <p>Loading games...</p>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="mt-8 matching-game">
            <h2 className="text-2xl font-semibold">Matching Game</h2>
            <p>Match the letters with the corresponding images!</p>
            {/* Add your game logic and UI here */}
          </div>

          <div className="mt-8 multiple-words-game">
            <h2 className="text-2xl font-semibold">Multiple Words Game</h2>
            <p>Drag and connect words to their corresponding cards!</p>
            {/* Add your game logic and UI here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
