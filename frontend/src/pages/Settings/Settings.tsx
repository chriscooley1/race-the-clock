import React, { useEffect, useState, useCallback } from "react";
import {
  useTheme,
  setThemeWithColorAdjustment,
} from "../../context/ThemeContext";
import { ColorScheme, colorSchemes } from "../../constants/colorSchemes";
import { tourStepsSettings } from "./tourStepsSettings";
import GuidedTour from "../../components/GuidedTour";
import { getLuminance } from "../../utils/colorUtils";
import FeedbackForm from "../../components/FeedbackForm";
import Navbar from "../../components/Navbar";
import { useTour } from "../../context/TourContext";

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
  } = useTheme();

  const { isGuidedTourEnabled, setIsGuidedTourEnabled } = useTour();

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [tourName, setTourName] = useState<string>("settings");
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

  const steps = tourStepsSettings(); // Remove the visibilityStates parameter

  const startTour = useCallback(() => {
    const tourCompleted = localStorage.getItem(`tourCompleted_${tourName}`);
    console.log("Starting tour, tourCompleted:", tourCompleted);
    if (isGuidedTourEnabled) {
      setIsTourRunning(true);
      setCurrentTourStep(0);
    }
  }, [tourName, isGuidedTourEnabled]);

  const handleTourComplete = () => {
    console.log(`Tour ${tourName} completed`);
    localStorage.setItem(`tourCompleted_${tourName}`, "true");
    setIsTourRunning(false);
  };

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
    '"KG What The Teacher Wants"',
    '"KG Shake It Off"',
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
        getLuminance(color.backgroundColor) < 0.5 ? "#FFFFFF" : "#000000";
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
      };
      return setThemeWithColorAdjustment(newTheme);
    });
  };

  const handleToggleDarkMode = () => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      isDarkMode: !prevTheme.isDarkMode,
    }));
  };

  const handleGuidedTourToggle = () => {
    setIsGuidedTourEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("guidedTourEnabled", JSON.stringify(newValue));
      return newValue;
    });
  };

  // Load the guided tour preference from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem("guidedTourEnabled");
    if (storedPreference !== null) {
      setIsGuidedTourEnabled(JSON.parse(storedPreference));
    }
  }, [setIsGuidedTourEnabled]);

  useEffect(() => {
    console.log("Tour state:", {
      isTourRunning,
      currentTourStep,
      steps,
    });
  }, [isTourRunning, currentTourStep, steps]);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[50px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"} mt-4`}
      style={{
        backgroundColor:
          theme.backgroundImage === "none"
            ? theme.backgroundColor
            : "transparent",
        color: theme.originalTextColor,
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
      <div className="absolute right-4 top-[65px] z-10 mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={theme.isDarkMode}
            onChange={handleToggleDarkMode}
            className="mr-2"
          />
          Toggle Dark Mode
        </label>
      </div>
      <div className="absolute right-4 top-[90px] z-10 mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isGuidedTourEnabled}
            onChange={handleGuidedTourToggle}
            className="mr-2"
          />
          Enable Guided Tour
        </label>
      </div>
      <div className="w-full space-y-6 px-4 md:px-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Main Font</h2>
          <select
            value={theme.font}
            onChange={handleFontChange}
            className="main-font rounded border border-gray-300 bg-white p-2 text-black"
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
          <h2 className="mb-2 text-xl font-semibold">Heading Font</h2>
          <select
            value={theme.headingFont}
            onChange={handleHeadingFontChange}
            className="heading-font rounded border border-gray-300 bg-white p-2 text-black"
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
          <h2 className="mb-2 text-xl font-semibold">Button Font</h2>
          <select
            value={theme.buttonFont}
            onChange={handleButtonFontChange}
            className="button-font rounded border border-gray-300 bg-white p-2 text-black"
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
                    handleColorThemeChange(newTheme); // Use the handleColorThemeChange function
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-bold">
            Text Color for Full Screen Display:
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
          <p>Current background image: {theme.backgroundImage}</p>
        </div>
      </div>
      {/* Button to show feedback form */}
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="bg-blue-500 mt-4 rounded px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning && isGuidedTourEnabled}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName={tourName}
      />
      <Navbar
        isPaused={false}
        onPauseResume={() => {}}
        onStartTour={startTour}
        setTourName={setTourName}
        setCurrentTourStep={setCurrentTourStep}
        setShowFeedback={setShowFeedback}
      />
    </div>
  );
};

export default Settings;
