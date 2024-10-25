import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const BadgesAchievements: React.FC = () => {
  const { theme } = useTheme();
  const [badges, setBadges] = useState<string[]>([]); // State to hold badges
  const [achievements, setAchievements] = useState<string[]>([]); // State to hold achievements
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Simulate loading data or setup
    const loadData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Example data
      setBadges(["Read 60 Letters in a Minute", "Complete an Advanced Session"]);
      setAchievements(["First Login", "Completed 5 Sessions"]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div
      className={`badges-achievements flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Badges & Achievements</h1>
      <p>
        Badges and Achievements: Create badges for students who achieve specific
        goals, like "Read 60 Letters in a Minute" or "Complete an Advanced
        Session."
      </p>
      <p>
        Milestones for Teachers: Teachers can set milestones for their students,
        rewarding them as they improve, fostering motivation.
      </p>

      {isLoading ? (
        <p>Loading badges and achievements...</p>
      ) : (
        <div className="w-full max-w-2xl mt-8">
          <div className="badges-section">
            <h2 className="text-2xl font-semibold">Badges</h2>
            <ul className="list-disc pl-5">
              {badges.map((badge, index) => (
                <li key={index}>{badge}</li>
              ))}
            </ul>
          </div>

          <div className="achievements-section mt-8">
            <h2 className="text-2xl font-semibold">Achievements</h2>
            <ul className="list-disc pl-5">
              {achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesAchievements;
