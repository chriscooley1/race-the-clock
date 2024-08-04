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
  violetTheme,
} from "../context/ThemeContext";
import "../App.css"; // Import the global CSS file

const themes = [
  { name: "Light Mode", theme: lightTheme },
  { name: "Dark Mode", theme: darkTheme },
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

const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Green", value: "#00ff00" },
  { label: "Yellow", value: "#ffff00" },
];

const ThemeSelector: React.FC = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themes.find(
      (theme) => theme.name === event.target.value
    );
    if (selectedTheme) {
      setTheme({ ...selectedTheme.theme, textColor: theme.textColor });
    }
  };

  const handleTextColorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      textColor: event.target.value,
    }));
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Select Theme:</label>
      <select id="theme-select" onChange={handleThemeChange}>
        {themes.map((theme, index) => (
          <option key={index} value={theme.name}>
            {theme.name}
          </option>
        ))}
      </select>

      <label htmlFor="text-color-select">Select Text Color:</label>
      <select id="text-color-select" value={theme.textColor} onChange={handleTextColorChange}>
        {textColorOptions.map((color, index) => (
          <option key={index} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
