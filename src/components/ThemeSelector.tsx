// ThemeSelector.tsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../themeOptions";
import "../App.css"; // Import the global CSS file

const ThemeSelector: React.FC = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themes.find(
      (theme) => theme.name === event.target.value
    );
    if (selectedTheme) {
      setTheme({ ...theme, className: selectedTheme.className });
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
      <select
        id="text-color-select"
        value={theme.textColor}
        onChange={handleTextColorChange}
      >
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
