import React from "react";
import { useTheme } from "../../context/ThemeContext";

const TimedChallenges: React.FC = () => {
  const { theme } = useTheme();

  const TimedChallengeGame: React.FC = () => {
    return (
      <div className="timed-challenge-game">
        <h2>Timed Challenge Game Example</h2>
        <p>Complete as many challenges as you can within the time limit!</p>
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
      <h1 className="mb-8 text-3xl font-bold">Timed Challenges</h1>
      <p>
        Timed Challenges: The goal remains to help kids (or adult learners) read
        60 items in a minute. Users can measure how many items they correctly
        identify within a session.
      </p>
      <TimedChallengeGame /> {/* Add the timed challenge game component here */}
    </div>
  );
};

export default TimedChallenges;
