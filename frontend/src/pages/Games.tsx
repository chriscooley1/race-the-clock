import React from "react";
import { useTheme } from "../context/ThemeContext";
import MatchingGame from "../components/MatchingGame";
import MultipleWordsGame from "../components/MultipleWordsGame";

const Games: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <MatchingGame />
      <MultipleWordsGame />
    </div>
  );
};

export default Games;
