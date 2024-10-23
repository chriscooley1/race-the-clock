import React from "react";
import { useTheme } from "../../context/ThemeContext";
import BadgesAchievementsOverview from "../../components/BadgesAchievementsOverview"; // Import the badges achievements overview component

const BadgesAchievements: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`badges-achievements flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="h1.mb-8 mb-8 text-3xl font-bold">Badges & Achievements</h1>
      <p>
        Badges and Achievements: Create badges for students who achieve specific
        goals, like "Read 60 Letters in a Minute" or "Complete an Advanced
        Session."
      </p>
      <p>
        Milestones for Teachers: Teachers can set milestones for their students,
        rewarding them as they improve, fostering motivation.
      </p>
      <BadgesAchievementsOverview /> {/* Add the badges achievements overview component here */}
    </div>
  );
};

export default BadgesAchievements;
