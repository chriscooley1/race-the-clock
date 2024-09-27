import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colorSchemes, ColorScheme } from "../../constants/colorSchemes";
import "./Settings.css";
import "../../App.css";

const colorOptions = [
  "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3",
  "#ffffff", "#000000", "#fdfd96", "#2e8b57", "#ff69b4", "#8a2be2", "#008080",
  "#ffc107", "#708090", "#ff00ff", "#e6e6fa", "#32cd32", "#00ffff", "#fbceb1",
  "#00a86b", "#ff6f61", "#034f84", "#f0f8ff", "#333333"
];

const colorblindTypes = [
  "Protanopia",
  "Deuteranopia",
  "Tritanopia",
  "Achromatopsia"
];

const Settings: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    setDisplayTextColor, 
    setDisplayBackgroundColor,
    setColorblindMode,
    setColorblindType
  } = useTheme();

  useEffect(() => {
    document.querySelectorAll(".color-option").forEach(el => {
      (el as HTMLElement).style.backgroundColor = el.getAttribute("data-color") || "";
    });
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Theme selected:", event.target.value);
    const newTheme = colorSchemes.find((scheme: ColorScheme) => scheme.name === event.target.value); // Add "ColorScheme" type
    if (newTheme) {
      setTheme({
        ...newTheme,
        isColorblindMode: false, 
        colorblindType: "none", 
      });
    }
  };

  const handleTextColorChange = (color: string) => {
    console.log("Text color selected:", color);
    setDisplayTextColor(color);
  };

  const handleBackgroundColorChange = (color: string) => {
    console.log("Background color selected:", color);
    setDisplayBackgroundColor(color);
  };

  const handleColorblindModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorblindMode(event.target.checked);
  };

  const handleColorblindTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setColorblindType(event.target.value);
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
          {colorSchemes.map((scheme: ColorScheme) => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="settings-label">Text Color for FullScreenDisplay:</label>
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`color-option ${theme.displayTextColor === color ? "selected" : ""}`}
              data-color={color}
              onClick={() => handleTextColorChange(color)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="settings-label">Background Color for FullScreenDisplay:</label>
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`color-option ${theme.displayBackgroundColor === color ? "selected" : ""}`}
              data-color={color}
              onClick={() => handleBackgroundColorChange(color)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="settings-label">
          <input
            type="checkbox"
            checked={theme.isColorblindMode}
            onChange={handleColorblindModeChange}
          />
          Enable Colorblind Mode
        </label>
      </div>
      {theme.isColorblindMode && (
        <div>
          <label htmlFor="colorblind-type-select" className="settings-label">Colorblind Type:</label>
          <select
            id="colorblind-type-select"
            value={theme.colorblindType}
            onChange={handleColorblindTypeChange}
          >
            {colorblindTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Settings;
