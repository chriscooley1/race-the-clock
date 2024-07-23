import React from "react";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme, blueTheme } from "../context/ThemeContext";
import "../App.css"; // Import the global CSS file

const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div className="theme-selector">
      <button type="button" onClick={() => setTheme(lightTheme)}>Light Mode</button>
      <button type="button" onClick={() => setTheme(darkTheme)}>Dark Mode</button>
      <button type="button" onClick={() => setTheme(blueTheme)}>Blue Theme</button>
    </div>
  );
};

export default ThemeSelector;
