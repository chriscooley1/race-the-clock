import React from "react";
import { useTheme, colorSchemes } from "../../context/ThemeContext/ThemeContext";
import "./ThemeSelector.css";

const ThemeSelector: React.FC = () => {
  const { setTheme, theme, setDisplayTextColor, setDisplayBackgroundColor } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScheme = colorSchemes.find(
      (scheme) => scheme.name === event.target.value
    );
    if (selectedScheme) {
      setTheme(selectedScheme);
    }
  };

  const handleTextColorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayTextColor(event.target.value);
  };

  const handleBackgroundColorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayBackgroundColor(event.target.value);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Select Theme:</label>
      <select id="theme-select" onChange={handleThemeChange} value={theme.name}>
        {colorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.name}>
            {scheme.name}
          </option>
        ))}
      </select>

      <label htmlFor="text-color-select">Select Display Text Color:</label>
      <select
        id="text-color-select"
        value={theme.displayTextColor || theme.textColor}
        onChange={handleTextColorChange}
      >
        {colorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.textColor}>
            {scheme.name} Text Color
          </option>
        ))}
      </select>

      <label htmlFor="background-color-select">Select Display Background Color:</label>
      <select
        id="background-color-select"
        value={theme.displayBackgroundColor || theme.backgroundColor}
        onChange={handleBackgroundColorChange}
      >
        {colorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.backgroundColor}>
            {scheme.name} Background
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
