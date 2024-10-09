import React from "react";
import { useTheme } from "../context/ThemeContext";

const Games: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>Matching Games: Develop a matching game where students associate letters or words with images, enhancing engagement.</p>
      <p>Multiple words, drag and connect to a different word or card</p>
    </div>
  );
};

export default Games;
