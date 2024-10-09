import React from "react";
import { useTheme } from "../context/ThemeContext";

const TimedChallenges: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Timed Challenges</h1>

    </div>
  );
};

export default TimedChallenges;
