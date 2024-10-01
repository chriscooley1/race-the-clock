import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colorSchemes, ColorScheme } from "../../constants/colorSchemes";
import "./Settings.css";
import "../../App.css";

const colorOptions = [
  'bright-red', 'bright-orange', 'bright-yellow', 'bright-green', 'bright-blue', 'bright-indigo', 'bright-violet',
  'white', 'black', 'pastel-yellow', 'custom-green', 'hot-pink', 'electric-purple', 'teal',
  'amber', 'slate', 'magenta', 'lavender', 'mint', 'cyan', 'apricot',
  'jade', 'coral', 'custom-blue', 'light-blue', 'theme-text'
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
    const newTheme = colorSchemes.find((scheme: ColorScheme) => scheme.name === event.target.value);
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
    <div className="pl-[250px] pt-[70px] p-5">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label htmlFor="theme-select" className="font-bold mr-2">Theme:</label>
        <select
          id="theme-select"
          value={theme.name}
          onChange={handleThemeChange}
          className="p-2 bg-white text-black border border-gray-300 rounded"
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
              key={color}
              className={`w-8 h-8 inline-block m-1 cursor-pointer border border-gray-300 transition-all duration-300 bg-${color} ${theme.displayTextColor === color ? "border-2 border-black" : ""}`}
              onClick={() => handleTextColorChange(color)}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="font-bold block mb-2">Background Color for FullScreenDisplay:</label>
        <div className="flex flex-wrap">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 inline-block m-1 cursor-pointer border border-gray-300 transition-all duration-300 bg-${color} ${theme.displayBackgroundColor === color ? "border-2 border-black" : ""}`}
              onClick={() => handleBackgroundColorChange(color)}
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
            className="p-2 bg-white text-black border border-gray-300 rounded"
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
