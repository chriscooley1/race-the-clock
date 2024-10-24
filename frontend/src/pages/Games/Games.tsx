import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Games: React.FC = () => {
  const { theme } = useTheme();

  const MatchingGame: React.FC = () => {
    return (
      <div className="matching-game">
        <h2>Matching Game Example</h2>
        <p>Match the letters with the corresponding images!</p>
        {/* Add your game logic and UI here */}
      </div>
    );
  };

  const MultipleWordsGame: React.FC = () => {
    return (
      <div className="multiple-words-game">
        <h2>Multiple Words Game Example</h2>
        <p>Drag and connect words to their corresponding cards!</p>
        {/* Add your game logic and UI here */}
      </div>
    );
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>
        Matching Games: Develop a matching game where students associate letters
        or words with images, enhancing engagement.
      </p>
      <p>Multiple words, drag and connect to a different word or card</p>
      <MatchingGame />
      <MultipleWordsGame />
    </div>
  );
};

export default Games;
