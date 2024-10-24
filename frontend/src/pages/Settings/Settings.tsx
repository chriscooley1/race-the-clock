import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colorSchemes } from "../../constants/colorSchemes";

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
    setFont,
    setHeadingFont,
    setButtonFont,
  } = useTheme();

  useEffect(() => {
    console.log("Theme changed:", theme); // New log
    localStorage.setItem("app-theme", JSON.stringify(theme));

    document.documentElement.style.setProperty(
      "--background-color",
      theme.backgroundColor,
    );
    document.documentElement.style.setProperty(
      "--text-color",
      theme.textColor ?? "",
    );
    document.documentElement.style.setProperty(
      "--display-text-color",
      theme.displayTextColor ?? "",
    );
    document.documentElement.style.setProperty(
      "--display-background-color",
      theme.displayBackgroundColor ?? "",
    );

    if (theme.backgroundImage && theme.backgroundImage !== "none") {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${theme.backgroundImage})`,
      );
      document.documentElement.style.setProperty(
        "--background-color",
        "transparent",
      );
    } else {
      document.documentElement.style.setProperty("--background-image", "none");
    }

    if (theme.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.style.setProperty("--font-family", theme.font);
    document.body.style.fontFamily = theme.font;
  }, [theme]);

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
    setTheme((prevTheme) => ({
      ...prevTheme,
      isColorblindMode: event.target.checked,
    }));
  };

  const handleColorblindTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setColorblindType(event.target.value);
    setTheme((prevTheme) => ({
      ...prevTheme,
      colorblindType: event.target.value,
    }));
  };

  const fonts = [
    "Comic Neue",
    "Arial",
    "Verdana",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Caveat",
    "Patrick Hand",
    "Chewy",
    "Baloo 2",
  ];

  const backgroundThemes = [
    { name: "None", value: "none" },
    { name: "Ultimate Frisbee", value: "/images/ultimate-frisbee-bg.jpg" },
    { name: "Nature Scene", value: "/images/nature-background.jpg" },
    { name: "Abstract Design", value: "/images/abstract-background.jpg" },
    { name: "Calming Visuals", value: "/images/calming-background.jpg" },
    { name: "City Skyline", value: "/images/city-skyline-bg.jpg" },
    { name: "Beach Sunset", value: "/images/beach-sunset-bg.jpg" },
    { name: "Mountain View", value: "/images/mountain-view-bg.jpg" },
    { name: "Space Exploration", value: "/images/space-exploration-bg.jpg" },
  ];

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const handleHeadingFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHeadingFont(e.target.value);
  };

  const handleButtonFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setButtonFont(e.target.value);
  };

  const handleBackgroundThemeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = e.target.value;
    console.log("Background theme selected:", selectedValue); // New log

    setTheme((prevTheme) => {
      const newTheme = {
        ...prevTheme,
        backgroundImage: selectedValue,
        backgroundColor:
          selectedValue === "none" ? prevTheme.backgroundColor : "transparent",
        textColor: selectedValue === "none" ? prevTheme.textColor : "#000000",
      };
      console.log("New theme after background change:", newTheme); // New log
      return newTheme;
    });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[50px] ${
        theme.isDarkMode ? "text-white" : "text-black"
      }`}
      style={{
        backgroundColor:
          theme.backgroundImage === "none"
            ? theme.backgroundColor
            : "transparent",
      }}
    >
      {theme.backgroundImage && theme.backgroundImage !== "none" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${theme.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        />
      )}
      <h1 className="settings mb-8 text-3xl font-bold">Settings</h1>

      <div className="w-full space-y-6 px-4 md:px-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Main Font</h2>
          <select
            value={theme.font}
            onChange={handleFontChange}
            className="main-font rounded border border-gray-300 bg-white p-2 text-black"
            title="Select main font"
          >
            {fonts.map((font) => (
              <option
                key={font}
                value={font}
                className={`font-${font.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Heading Font</h2>
          <select
            value={theme.headingFont}
            onChange={handleHeadingFontChange}
            className="heading-font rounded border border-gray-300 bg-white p-2 text-black"
            title="Select heading font"
          >
            {fonts.map((font) => (
              <option
                key={font}
                value={font}
                className={`font-${font.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Button Font</h2>
          <select
            value={theme.buttonFont}
            onChange={handleButtonFontChange}
            className="button-font rounded border border-gray-300 bg-white p-2 text-black"
            title="Select button font"
          >
            {fonts.map((font) => (
              <option
                key={font}
                value={font}
                className={`font-${font.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold">Color Theme:</label>
          <div className="flex flex-wrap">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                className={`color-theme m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.name === color.name ? "border-4 border-black" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  const newTheme = colorSchemes.find(
                    (scheme) => scheme.name === color.name,
                  );
                  if (newTheme) {
                    setTheme((prevTheme) => ({
                      ...newTheme,
                      isColorblindMode: prevTheme.isColorblindMode,
                      colorblindType: prevTheme.colorblindType,
                      isDarkMode: prevTheme.isDarkMode,
                      font: prevTheme.font,
                      headingFont: prevTheme.headingFont,
                      buttonFont: prevTheme.buttonFont,
                      backgroundImage: prevTheme.backgroundImage,
                      adjustColorForColorblindness:
                        prevTheme.adjustColorForColorblindness,
                    }));
                  }
                }}
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
                className={`text-color m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayTextColor === color.value ? "border-4 border-black" : ""}`}
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
                className={`background-color m-1 inline-block size-8 cursor-pointer border border-gray-300 transition-all duration-300 ${theme.displayBackgroundColor === color.value ? "border-4 border-black" : ""}`}
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
                className="accessibility mr-2"
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
        <div>
          <h2 className="mb-2 text-xl font-semibold">Background Theme</h2>
          <select
            value={theme.backgroundImage}
            onChange={handleBackgroundThemeChange}
            className="background-theme rounded border border-gray-300 bg-white p-2 text-black"
            title="Select background theme"
          >
            {backgroundThemes.map((theme) => (
              <option key={theme.name} value={theme.value}>
                {theme.name}
              </option>
            ))}
          </select>
          <p>Current background image: {theme.backgroundImage}</p>{" "}
          {/* New debug line */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
