import React from "react";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme, blueTheme } from "../context/ThemeContext";

const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme(lightTheme)}>Light Mode</button>
      <button onClick={() => setTheme(darkTheme)}>Dark Mode</button>
      <button onClick={() => setTheme(blueTheme)}>Blue Theme</button>
    </div>
  );
};

export default ThemeSelector;
