import React from "react";
import { useTheme } from "../context/ThemeContext";

const Milestones: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Milestones</h1>
      <p>Milestones for Teachers: Teachers can set milestones for their students, rewarding them as they improve, fostering motivation.</p>
    </div>
  );
};

export default Milestones;
