import React, { useEffect, useState } from "react";
import {
  useTheme,
  setThemeWithColorAdjustment,
} from "../../context/ThemeContext";
import { ColorScheme, colorSchemes } from "../../constants/colorSchemes";
import { tourStepsSettings } from "./tourStepsSettings";
import GuidedTour from "../../components/GuidedTour";
import { getLuminance } from "../../utils/colorUtils";
import { useTour } from "../../context/TourContext";
import { adjustColorForColorblindness } from "../../utils/colorAdjustment";
import BubbleText from "../../components/BubbleText";

const DEFAULT_THEME = {
  name: "White",
  backgroundColor: "#FFFFFF",
  textColor: "#333333",
  displayTextColor: "#333333",
  displayBackgroundColor: "#FFFFFF",
  backgroundImage: "none",
  isColorblindMode: false,
  colorblindType: "none",
  isDarkMode: false,
  font: '"font-happy-paragraphs-regular"',
  headingFont: '"font-happy-paragraphs-regular"',
  buttonFont: '"font-happy-paragraphs-regular"',
  displayFont: '"font-happy-paragraphs-regular"',
  originalTextColor: "#333333",
  originalBackgroundColor: "#FFFFFF",
};

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
    setColorblindMode,
    setColorblindType,
    setFont,
    setHeadingFont,
    setButtonFont,
    setDisplayFont,
  } = useTheme();

  const { isGuidedTourEnabled, setIsGuidedTourEnabled } = useTour();

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const tourName = "settings";

  const steps = tourStepsSettings();

  const handleTourComplete = () => {
    console.log(`Tour ${tourName} completed`);
    localStorage.setItem(`tourCompleted_${tourName}`, "true");
    setIsTourRunning(false);
    setCurrentTourStep(0);
  };

  const handleStartTour = () => {
    setCurrentTourStep(0);
    setIsTourRunning(true);
  };

  useEffect(() => {
    const handleTourReset = () => {
      setCurrentTourStep(0);
      setIsTourRunning(false);
    };

    document.addEventListener("tourSkipped", handleTourReset);

    return () => {
      document.removeEventListener("tourSkipped", handleTourReset);
    };
  }, []);

  const handleTextColorChange = (color: string) => {
    console.log("Text color selected:", color);
    setDisplayTextColor(color);
  };

  const handleColorblindModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;
    setColorblindMode(isChecked); // This will now trigger color adjustments
    // Optionally, you can also set a default colorblind type if needed
    if (isChecked && !theme.colorblindType) {
      setColorblindType("protanopia"); // Set a default type if none is selected
    }
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
    "Happy Paragraphs Regular",
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
    "KG What The Teacher Wants",
    "KG Shake It Off",
    "Happy Covers Regular",
    "Happy Covers Shadow Regular",
    "Happy Fun Letters Regular",
    "Happy Fun Letters Titles Regular",
    "Happy Fun Letters Titles Shadow Regular",
    "Happy Letters Regular",
    "Happy Medium Regular",
    "Happy Medium Shadow Regular",
    "Happy Neat Handwriting Regular",
    "Happy Task Card Labels Regular",
    "Happy Titles Regular",
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
    const selectedFont = e.target.value;
    const cssFont = selectedFont.replace(/^["'](.+)["']$/, "$1");
    setFont(selectedFont);
    document.documentElement.style.setProperty(
      "--font-family",
      cssFont.includes(" ") ? `"${cssFont}"` : cssFont,
    );

    // Log the selected font for testing
    console.log("Selected font:", selectedFont);
  };

  const handleHeadingFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    const cssFont = selectedFont.replace(/^["'](.+)["']$/, "$1");
    const formattedFont = cssFont === "Baloo 2" ? '"Baloo 2"' : cssFont;

    setHeadingFont(selectedFont);
    document.documentElement.style.setProperty(
      "--heading-font-family",
      formattedFont,
    );
  };

  const handleButtonFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    const cssFont = selectedFont.replace(/^["'](.+)["']$/, "$1");
    const formattedFont = cssFont === "Baloo 2" ? '"Baloo 2"' : cssFont;

    setButtonFont(selectedFont);
    document.documentElement.style.setProperty(
      "--button-font-family",
      formattedFont,
    );
  };

  const handleDisplayFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    const cssFont = selectedFont.replace(/^["'](.+)["']$/, "$1");
    const formattedFont = cssFont === "Baloo 2" ? '"Baloo 2"' : cssFont;

    setDisplayFont(selectedFont);
    document.documentElement.style.setProperty(
      "--display-font-family",
      formattedFont,
    );
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

  const handleColorThemeChange = (color: ColorScheme) => {
    setTheme((prevTheme) => {
      const newDisplayTextColor =
        color.backgroundColor.toLowerCase() === "#000000"
          ? "#FFFFFF"
          : getLuminance(color.backgroundColor) < 0.5
            ? "#FFFFFF"
            : "#000000";

      const newTheme = {
        ...color,
        isColorblindMode: prevTheme.isColorblindMode,
        colorblindType: prevTheme.colorblindType,
        isDarkMode: prevTheme.isDarkMode,
        font: prevTheme.font,
        headingFont: prevTheme.headingFont,
        buttonFont: prevTheme.buttonFont,
        originalTextColor: newDisplayTextColor,
        originalBackgroundColor: color.backgroundColor,
        adjustColorForColorblindness: prevTheme.adjustColorForColorblindness,
        displayTextColor: newDisplayTextColor,
        textColor: newDisplayTextColor,
        displayFont: prevTheme.displayFont,
      };
      return setThemeWithColorAdjustment(newTheme);
    });
  };

  // Load the guided tour preference from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem("guidedTourEnabled");
    if (storedPreference !== null) {
      const parsedPreference = JSON.parse(storedPreference);
      setIsGuidedTourEnabled((prev) => {
        if (prev !== parsedPreference) {
          return parsedPreference;
        }
        return prev;
      });
    }
  }, [setIsGuidedTourEnabled]);

  useEffect(() => {
    console.log("Tour state:", {
      isTourRunning,
      currentTourStep,
      steps,
    });
  }, [isTourRunning, currentTourStep, steps]);

  const isColorDisabled = (color: string) => {
    // Special case for black (#000000) - always allow it
    if (color.toLowerCase() === "#000000") {
      return false;
    }

    return (
      theme.displayTextColor === color ||
      theme.backgroundColor === color ||
      theme.displayBackgroundColor === color
    );
  };

  // Function to get adjusted color options based on colorblind type
  const getAdjustedColorOptions = () => {
    return colorOptions.map((color) => ({
      ...color,
      adjustedValue: theme.isColorblindMode
        ? adjustColorForColorblindness(color.value, theme.colorblindType)
        : color.value,
    }));
  };

  // Function to get adjusted text color options based on colorblind type
  const getAdjustedTextColorOptions = () => {
    return colorOptions.map((color) => ({
      ...color,
      adjustedValue: theme.isColorblindMode
        ? adjustColorForColorblindness(color.value, theme.colorblindType)
        : color.value,
    }));
  };

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" ||
      getLuminance(backgroundColor) < 0.5
      ? "text-white"
      : "text-black";
  };

  const handleResetToDefaults = () => {
    // Format the font names with proper quotes
    const formattedFont = '"Happy Paragraphs Regular", "Comic Neue", sans-serif';
    
    // Reset theme context with properly formatted fonts
    setTheme((prevTheme) => ({
      ...DEFAULT_THEME,
      adjustColorForColorblindness: prevTheme.adjustColorForColorblindness,
      font: formattedFont,
      headingFont: formattedFont,
      buttonFont: formattedFont,
      displayFont: formattedFont,
    }));

    // Reset individual font settings
    setFont(formattedFont);
    setHeadingFont(formattedFont);
    setButtonFont(formattedFont);
    setDisplayFont(formattedFont);

    // Reset colors
    setDisplayTextColor(DEFAULT_THEME.displayTextColor);

    // Reset CSS variables with properly formatted fonts
    document.documentElement.style.setProperty("--font-family", formattedFont);
    document.documentElement.style.setProperty("--heading-font-family", formattedFont);
    document.documentElement.style.setProperty("--button-font-family", formattedFont);
    document.documentElement.style.setProperty("--display-font-family", formattedFont);
    document.documentElement.style.setProperty("--background-image", "none");
  };

  return (
    <div
      className={`page-container mt-[20px] flex flex-col items-center ${getTextColorClass(theme.backgroundColor)}`}
    >
      <div className="absolute right-6 top-[280px] flex flex-col space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isGuidedTourEnabled}
            onChange={(e) => setIsGuidedTourEnabled(e.target.checked)}
            className="mr-2"
          />
          Enable Guided Tour
        </label>
      </div>

      <h1 className={`settings inherit mb-8 text-3xl font-bold`}>
        <BubbleText>Settings</BubbleText>
      </h1>
      <div className="w-full space-y-6 px-4 md:px-8">
        <div>
          <h2 className="inherit mb-2 text-xl font-semibold">Main Font</h2>
          <select
            value={theme.font}
            onChange={handleFontChange}
            className="main-font rounded border border-black bg-white p-2 text-black"
            title="Select main font"
          >
            {fonts.map((font) => {
              const fontName = font.replace(/^["'](.+)["']$/, "$1");
              return (
                <option
                  key={font}
                  value={font}
                  style={{ fontFamily: fontName }}
                >
                  {fontName}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <h2 className="inherit mb-2 text-xl font-semibold">Heading Font</h2>
          <select
            value={theme.headingFont}
            onChange={handleHeadingFontChange}
            className="heading-font rounded border border-black bg-white p-2 text-black"
            title="Select heading font"
          >
            {fonts.map((font) => {
              const fontName = font.replace(/^["'](.+)["']$/, "$1");
              return (
                <option
                  key={font}
                  value={font}
                  style={{ fontFamily: fontName }}
                >
                  {fontName}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <h2 className="inherit mb-2 text-xl font-semibold">Button Font</h2>
          <select
            value={theme.buttonFont}
            onChange={handleButtonFontChange}
            className="button-font rounded border border-black bg-white p-2 text-black"
            title="Select button font"
          >
            {fonts.map((font) => {
              const fontName = font.replace(/^["'](.+)["']$/, "$1");
              return (
                <option
                  key={font}
                  value={font}
                  style={{ fontFamily: fontName }}
                >
                  {fontName}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <h2 className="inherit mb-2 text-xl font-semibold">
            Full Screen Display Font
          </h2>
          <select
            value={theme.displayFont}
            onChange={handleDisplayFontChange}
            className="display-font rounded border border-black bg-white p-2 text-black"
            title="Select full screen display font"
          >
            {fonts.map((font) => {
              const fontName = font.replace(/^["'](.+)["']$/, "$1");
              return (
                <option
                  key={font}
                  value={font}
                  style={{ fontFamily: fontName }}
                >
                  {fontName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-4 text-left w-full">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
            title="Reset all settings to default values"
          >
            Reset to Default Settings
          </button>
        </div>

        <div className="mb-4">
          <label className="inherit mb-2 block font-bold">Color Theme:</label>
          <div className="flex flex-wrap">
            {getAdjustedColorOptions().map((color) => (
              <div
                key={color.name}
                className={`color-theme m-1 inline-block size-8 cursor-pointer border border-black transition-all duration-300 ${theme.name === color.name ? "border-4 border-black" : ""} ${isColorDisabled(color.adjustedValue) ? "cursor-not-allowed opacity-50" : ""}`}
                style={{
                  backgroundColor: color.adjustedValue,
                  ...(theme.name === color.name &&
                  color.adjustedValue.toLowerCase() === "#000000"
                    ? { backgroundColor: "#404040" }
                    : {}),
                }}
                onClick={() => {
                  if (!isColorDisabled(color.adjustedValue)) {
                    const newTheme = colorSchemes.find(
                      (scheme) => scheme.name === color.name,
                    );
                    if (newTheme) {
                      handleColorThemeChange(newTheme);
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="inherit mb-2 block font-bold">
            Text Color for Full Screen Display:
          </label>
          <div className="flex flex-wrap">
            {getAdjustedTextColorOptions().map((color) => (
              <div
                key={color.name}
                className={`text-color m-1 inline-block size-8 cursor-pointer border border-black transition-all duration-300 ${theme.displayTextColor === color.adjustedValue ? "border-4 border-black" : ""} ${isColorDisabled(color.adjustedValue) ? "cursor-not-allowed opacity-50" : ""}`}
                style={{ backgroundColor: color.adjustedValue }}
                onClick={() => {
                  if (!isColorDisabled(color.adjustedValue)) {
                    handleTextColorChange(color.adjustedValue);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="inherit mb-2 text-xl font-semibold">Accessibility</h2>
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
          <h2 className="inherit mb-2 text-xl font-semibold">
            Background Theme
          </h2>
          <select
            value={theme.backgroundImage}
            onChange={handleBackgroundThemeChange}
            className="background-theme rounded border border-black bg-white p-2 text-black"
            title="Select background theme"
          >
            {backgroundThemes.map((theme) => (
              <option key={theme.name} value={theme.value}>
                {theme.name}
              </option>
            ))}
          </select>
          <p>Current background image: {theme.backgroundImage}</p>
        </div>
      </div>

      <GuidedTour
        steps={steps}
        isRunning={isTourRunning && isGuidedTourEnabled}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName={tourName}
        onStart={handleStartTour}
      />
    </div>
  );
};

export default Settings;
