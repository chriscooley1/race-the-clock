import React from "react";
import { useTheme, colorSchemes } from "../../context/ThemeContext";
import "./Settings.css";
import "../../App.css"; // Global styles for the app

const colorOptions = [
  "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3", // Bright colors
  "#ffffff", "#000000", "#fdfd96", "#2e8b57", "#ff69b4", "#8a2be2", "#008080", // Additional colors
  "#ffc107", "#708090", "#ff00ff", "#e6e6fa", "#32cd32", "#00ffff", "#fbceb1", // More colors
  "#00a86b", "#ff6f61", "#034f84", "#f0f8ff", "#333333" // Even more colors
];

const Settings: React.FC = () => {
  const { theme, setTheme, setDisplayTextColor, setDisplayBackgroundColor } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = colorSchemes.find(scheme => scheme.name === event.target.value);
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  const handleTextColorChange = (color: string) => {
    setDisplayTextColor(color);
  };

  const handleBackgroundColorChange = (color: string) => {
    setDisplayBackgroundColor(color);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div>
        <label htmlFor="theme-select" className="settings-label">Theme:</label>
        <select
          id="theme-select"
          value={theme.name}
          onChange={handleThemeChange}
        >
          {colorSchemes.map(scheme => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="settings-label">Text Color for Display:</label>
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`color-option ${theme.displayTextColor === color ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleTextColorChange(color)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="settings-label">Background Color for Display:</label>
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`color-option ${theme.displayBackgroundColor === color ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleBackgroundColorChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
