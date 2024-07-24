import React from "react";
import { useTheme } from "../context/ThemeContext";
import {
  darkTheme,
  lightTheme,
  blueTheme,
  neonPinkTheme,
  neonGreenTheme,
  neonBlueTheme,
  neonOrangeTheme,
  redTheme,
  orangeTheme,
  yellowTheme,
  greenTheme,
  blueThemeColor,
  indigoTheme,
  violetTheme
} from "../context/ThemeContext";
import "../App.css"; // Import the global CSS file

const themes = [
  { name: "Dark Mode", theme: darkTheme },
  { name: "Light Mode", theme: lightTheme },
  { name: "Blue Theme", theme: blueTheme },
  { name: "Neon Pink", theme: neonPinkTheme },
  { name: "Neon Green", theme: neonGreenTheme },
  { name: "Neon Blue", theme: neonBlueTheme },
  { name: "Neon Orange", theme: neonOrangeTheme },
  { name: "Red", theme: redTheme },
  { name: "Orange", theme: orangeTheme },
  { name: "Yellow", theme: yellowTheme },
  { name: "Green", theme: greenTheme },
  { name: "Blue", theme: blueThemeColor },
  { name: "Indigo", theme: indigoTheme },
  { name: "Violet", theme: violetTheme },
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
