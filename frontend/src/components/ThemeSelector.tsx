import React from "react";
import { useTheme } from "../context/ThemeContext";
import { colorSchemes, textColorOptions } from "../context/ThemeContext";
import "../App.css";

const ThemeSelector: React.FC = () => {
  const { setTheme, theme } = useTheme();

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
    setTheme((prevTheme) => ({
      ...prevTheme,
      textColor: event.target.value,
    }));
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
