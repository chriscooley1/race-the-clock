import React from "react";
import { useTheme } from "../context/ThemeContext";
import {
  appBackgroundColors,
  collectionColorSchemes,
  ColorScheme,
  colorSchemes,
} from "../constants/colorSchemes";
import { adjustColorForColorblindness as adjustColor } from "../utils/colorAdjustment";

const ThemeSelector: React.FC = () => {
  const {
    setTheme,
    theme,
    setDisplayTextColor,
    setDisplayBackgroundColor,
    toggleDarkMode,
  } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScheme = colorSchemes.find(
      (scheme: ColorScheme) => scheme.name === event.target.value,
    );
    if (selectedScheme) {
      setTheme((prevTheme) => {
        // Store the new original colors
        const originalTextColor = selectedScheme.textColor;
        const originalBackgroundColor = selectedScheme.backgroundColor;

        // Create base theme
        const baseTheme = {
          ...selectedScheme,
          isColorblindMode: prevTheme.isColorblindMode,
          colorblindType: prevTheme.colorblindType,
          isDarkMode: prevTheme.isDarkMode,
          font: prevTheme.font,
          headingFont: prevTheme.headingFont,
          buttonFont: prevTheme.buttonFont,
          originalTextColor,
          originalBackgroundColor,
          adjustColorForColorblindness: prevTheme.adjustColorForColorblindness,
        };

        // If colorblind mode is enabled, adjust the colors
        if (prevTheme.isColorblindMode) {
          const adjustedTextColor = adjustColor(
            originalTextColor,
            prevTheme.colorblindType
          );
          const adjustedBackgroundColor = adjustColor(
            originalBackgroundColor,
            prevTheme.colorblindType
          );

          return {
            ...baseTheme,
            displayTextColor: adjustedTextColor,
            displayBackgroundColor: adjustedBackgroundColor,
          };
        }

        // If colorblind mode is not enabled, use the original colors
        return {
          ...baseTheme,
          displayTextColor: originalTextColor,
          displayBackgroundColor: originalBackgroundColor,
        };
      });
    }
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value;
    if (theme.isColorblindMode) {
      setDisplayTextColor(adjustColor(newColor, theme.colorblindType));
    } else {
      setDisplayTextColor(newColor);
    }
    setTheme(prevTheme => ({
      ...prevTheme,
      originalTextColor: newColor,
    }));
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value;
    if (theme.isColorblindMode) {
      setDisplayBackgroundColor(adjustColor(newColor, theme.colorblindType));
    } else {
      setDisplayBackgroundColor(newColor);
    }
    setTheme(prevTheme => ({
      ...prevTheme,
      originalBackgroundColor: newColor,
    }));
  };

  return (
    <div className="bg-theme-bg text-theme-text mt-5 w-full max-w-[300px] rounded-md border-none p-4">
      <label htmlFor="theme-select" className="mb-2 block font-bold">
        Select App Background:
      </label>
      <select
        id="theme-select"
        value={theme.name}
        onChange={handleThemeChange}
        className="bg-right-8-center mb-4 w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat p-2 text-black"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
        }}
      >
        {(appBackgroundColors as ColorScheme[]).map(
          (scheme: ColorScheme, index: number) => (
            <option key={index} value={scheme.name}>
              {scheme.name}
            </option>
          ),
        )}
      </select>

      <label htmlFor="text-color-select" className="mb-2 block font-bold">
        Select Display Text Color:
      </label>
      <select
        id="text-color-select"
        value={theme.displayTextColor || theme.textColor}
        onChange={handleTextColorChange}
        className="bg-right-8-center mb-4 w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat p-2 text-black"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
        }}
      >
        {collectionColorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.textColor}>
            {scheme.name} Text Color
          </option>
        ))}
      </select>

      <label htmlFor="background-color-select" className="mb-2 block font-bold">
        Select Display Background Color:
      </label>
      <select
        id="background-color-select"
        value={theme.displayBackgroundColor || theme.backgroundColor}
        onChange={handleBackgroundColorChange}
        className="bg-right-8-center mb-4 w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat p-2 text-black"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
        }}
      >
        {collectionColorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.backgroundColor}>
            {scheme.name} Background
          </option>
        ))}
      </select>

      <label htmlFor="dark-mode-toggle" className="mb-2 block font-bold">
        Dark Mode:
      </label>
      <button
        id="dark-mode-toggle"
        onClick={toggleDarkMode}
        className="text-theme-text bg-theme-bg mb-4 w-full rounded-md border border-gray-300 p-2"
      >
        {theme.isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
      </button>
    </div>
  );
};

export default ThemeSelector;
