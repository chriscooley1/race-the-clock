import React from "react";
import { useTheme } from "../context/ThemeContext";

const BadgesAchievements: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Badges & Achievements</h1>
      <p>Badges and Achievements: Create badges for students who achieve specific goals, like "Read 60 Letters in a Minute" or "Complete an Advanced Session."</p>
    </div>
  );
};

export default BadgesAchievements;
