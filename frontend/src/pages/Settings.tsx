import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { colorSchemes, ColorScheme } from "../constants/colorSchemes";

const colorOptions = colorSchemes.map((scheme) => ({
  name: scheme.name,
  value: scheme.backgroundColor,
}));

const colorblindTypes = [
  "Protanopia",
  "Protanomaly",
  "Deuteranopia",
  "Deuteranomaly",
  "Tritanopia",
  "Tritanomaly",
  "Achromatopsia",
  "Anomalous Trichromacy",
];

const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    setDisplayTextColor,
    setDisplayBackgroundColor,
    setColorblindMode,
    setColorblindType,
  } = useTheme();

  useEffect(() => {
    document.querySelectorAll(".color-option").forEach((el) => {
      (el as HTMLElement).style.backgroundColor =
        el.getAttribute("data-color") || "";
    });
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Theme selected:", event.target.value);
    const newTheme = colorSchemes.find(
      (scheme: ColorScheme) => scheme.name === event.target.value,
    );
    if (newTheme) {
      setTheme({
        ...newTheme,
        isColorblindMode: false,
        colorblindType: "none",
        isDarkMode: newTheme.name === "Black", // Set isDarkMode based on the theme name
        displayTextColor: theme.displayTextColor, // Preserve existing display colors
        displayBackgroundColor: theme.displayBackgroundColor,
        font: theme.font,
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

  const handleColorblindModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setColorblindMode(event.target.checked);
  };

  const handleColorblindTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setColorblindType(event.target.value);
  };

  const fonts = [
    "Comic Neue",
    "Arial",
    "Verdana",
    "Helvetica",
    "Times New Roman",
    "Courier New",
  ];

  const backgroundThemes = [
    { name: "Default", value: "none" },
    { name: "Nature Scene", value: "/images/nature-background.jpg" },
    { name: "Abstract Design", value: "/images/abstract-background.jpg" },
    { name: "Calming Visuals", value: "/images/calming-background.jpg" },
  ];

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme({ ...theme, font: e.target.value });
  };

  const handleBackgroundThemeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setTheme({ ...theme, backgroundImage: e.target.value });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="w-full space-y-6 px-4 md:px-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Font</h2>
          <select
            value={theme.font}
            onChange={handleFontChange}
            className="font-caveat rounded border border-gray-300 bg-white p-2 text-black"
            title="Select font"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Background Theme</h2>
          <select
            value={theme.backgroundImage}
            onChange={handleBackgroundThemeChange}
            className="font-caveat rounded border border-gray-300 bg-white p-2 text-black"
            title="Select background theme"
          >
            {backgroundThemes.map((bgTheme) => (
              <option key={bgTheme.name} value={bgTheme.value}>
                {bgTheme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold">
            Color Theme:
          </label>
          <div className="flex flex-wrap">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                className={`m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.name === color.name ? "border-2 border-black" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleThemeChange({ target: { value: color.name } } as React.ChangeEvent<HTMLSelectElement>)} // Cast to the correct type
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold">
            Text Color for FullScreenDisplay:
          </label>
          <div className="flex flex-wrap">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                className={`m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayTextColor === color.value ? "border-2 border-black" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleTextColorChange(color.value)}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold">
            Background Color for FullScreenDisplay:
          </label>
          <div className="flex flex-wrap">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                className={`m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayBackgroundColor === color.value ? "border-2 border-black" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleBackgroundColorChange(color.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Accessibility</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={theme.isColorblindMode}
                onChange={handleColorblindModeChange}
                className="mr-2"
              />
              Enable Colorblind Mode
            </label>
            {theme.isColorblindMode && (
              <select
                value={theme.colorblindType}
                onChange={handleColorblindTypeChange}
                className="w-full max-w-xs rounded border p-2 text-black"
                title="Select colorblind type"
              >
                {colorblindTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
