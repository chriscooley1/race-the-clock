import React from "react";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../context/themes";

const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme(lightTheme)}>Light Theme</button>
      <button onClick={() => setTheme(darkTheme)}>Dark Theme</button>
    </div>
  );
};

export default ThemeSelector;
