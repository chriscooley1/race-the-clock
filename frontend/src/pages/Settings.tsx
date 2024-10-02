import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { colorSchemes, ColorScheme } from "../constants/colorSchemes";

const colorOptions = colorSchemes.map(scheme => ({
  name: scheme.name,
  value: scheme.backgroundColor
}));

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
    const newTheme = colorSchemes.find((scheme: ColorScheme) => scheme.name === event.target.value);
    if (newTheme) {
      setTheme({
        ...newTheme,
        isColorblindMode: false, 
        colorblindType: "none",
        isDarkMode: newTheme.name === "Black", // Set isDarkMode based on the theme name
        displayTextColor: theme.displayTextColor, // Preserve existing display colors
        displayBackgroundColor: theme.displayBackgroundColor,
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
    <div className="pl-[250px] pt-[70px] p-5">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label htmlFor="theme-select" className="font-bold mr-2">Theme:</label>
        <select
          id="theme-select"
          value={theme.name}
          onChange={handleThemeChange}
          className="p-2 bg-white text-black border border-gray-300 rounded font-caveat"
        >
          {colorSchemes.map((scheme: ColorScheme) => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="font-bold block mb-2">Text Color for FullScreenDisplay:</label>
        <div className="flex flex-wrap">
          {colorOptions.map((color) => (
            <div
              key={color.name}
              className={`w-8 h-8 inline-block m-1 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayTextColor === color.value ? "border-2 border-black" : ""}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleTextColorChange(color.value)}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="font-bold block mb-2">Background Color for FullScreenDisplay:</label>
        <div className="flex flex-wrap">
          {colorOptions.map((color) => (
            <div
              key={color.name}
              className={`w-8 h-8 inline-block m-1 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayBackgroundColor === color.value ? "border-2 border-black" : ""}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleBackgroundColorChange(color.value)}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={theme.isColorblindMode}
            onChange={handleColorblindModeChange}
            className="mr-2"
          />
          <span className="font-bold">Enable Colorblind Mode</span>
        </label>
      </div>
      {theme.isColorblindMode && (
        <div>
          <label htmlFor="colorblind-type-select" className="font-bold mr-2">Colorblind Type:</label>
          <select
            id="colorblind-type-select"
            value={theme.colorblindType}
            onChange={handleColorblindTypeChange}
            className="p-2 bg-white text-black border border-gray-300 rounded font-caveat"
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
