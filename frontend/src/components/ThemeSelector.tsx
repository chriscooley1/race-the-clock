import React from "react";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme, blueTheme } from "../context/ThemeContext";
import "../App.css"; // Import the global CSS file

const themes = [
  { name: "Light Mode", theme: lightTheme },
  { name: "Dark Mode", theme: darkTheme },
  { name: "Blue Theme", theme: blueTheme },
  // Add more themes here as needed
];

const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themes.find(theme => theme.name === event.target.value);
    if (selectedTheme) {
      setTheme(selectedTheme.theme);
    }
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Select Theme:</label>
      <select id="theme-select" onChange={handleChange}>
        {themes.map((theme, index) => (
          <option key={index} value={theme.name}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
