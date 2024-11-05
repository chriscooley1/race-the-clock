import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colorSchemes } from "../../constants/colorSchemes";
import { tourStepsSettings } from "./tourStepsSettings";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";
import { adjustColorForColorblindness } from "../../utils/colorAdjustment";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserRole } from "../../api"; // Assume you have an API function to update user role
import ToggleSwitch from "../../components/ToggleSwitch";

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

  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isDotCountTypeVisible: false,
    isMinDotsVisible: false,
    isMaxDotsVisible: false,
    isTypeSelectVisible: false,
    isItemCountVisible: false,
    isCollectionItemCountVisible: false,
    isDotColorVisible: false,
    isDotShapeVisible: false,
    isGenerateRandomSequenceButtonVisible: false,
    isFileUploadVisible: false,
    isNextButtonVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isBadgesSectionVisible: false,
    isAchievementsSectionVisible: false,
    isLoadingMessageVisible: false,
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isPreviousButtonVisible: false,
    isProgressIndicatorVisible: false,
    isPauseButtonVisible: false,
    isScreenClickAreaVisible: false,
    isMatchingGameVisible: false,
    isMultipleWordsGameVisible: false,
    isRegisterButtonVisible: false,
    isLoginButtonVisible: false,
    isProfileVisible: false,
    isUpdateFormVisible: false,
    isNameInputVisible: true,
    isAddNameButtonVisible: true,
    isSpinButtonVisible: true,
    isNamesListVisible: true,
    isCollectionNameVisible: true,
    isCategorySelectVisible: true,
    isStageSelectVisible: true,
    isPublicCheckboxVisible: true,
    isSubmitButtonVisible: true,
    isReportsOverviewVisible: false,
    isReportsListVisible: false,
    isFAQSectionVisible: false,
    isInstructionalVideosVisible: false,
    isTimedChallengesVisible: false,
    isCollectionsOverviewVisible: false,
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
    isMainFontVisible: true,
    isHeadingFontVisible: true,
    isButtonFontVisible: true,
    isColorThemeVisible: true,
    isTextColorVisible: true,
    isBackgroundColorVisible: true,
    isAccessibilityVisible: true,
    isBackgroundThemeVisible: true,
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const steps = tourStepsSettings(visibilityStates); // Create tour steps based on visibility states

  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  useEffect(() => {
    startTour(); // Call the startTour function
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
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

  useEffect(() => {
    // Example condition to update visibility states
    setVisibilityStates((prev) => ({
      ...prev,
      isDotCountTypeVisible: true, // Update based on your logic
    }));
  }, []); // Add dependencies as needed

  const { user, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState<string>("student"); // Default role

  useEffect(() => {
    console.log("Settings component mounted. Current user:", user);
    console.log("Initial role:", role);
  }, [user]);

  const handleRoleChange = async (newRole: string) => {
    console.log("Changing role to:", newRole);
    if (user && user.sub) {
      const token = await getAccessTokenSilently();
      try {
        const updatedUser = await updateUserRole(user.sub, newRole, token);
        console.log("Role updated successfully:", updatedUser);
        setRole(newRole); // Update the local state
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
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
      <ToggleSwitch role={role} onChange={handleRoleChange} />

      <div className="w-full space-y-6 px-4 md:px-8">
        {visibilityStates.isMainFontVisible && (
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
        )}

        {visibilityStates.isHeadingFontVisible && (
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
        )}

        {visibilityStates.isButtonFontVisible && (
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
        )}

        {visibilityStates.isColorThemeVisible && (
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
                      setTheme((prevTheme) => {
                        const baseTheme = {
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
                          originalTextColor: newTheme.textColor,
                          originalBackgroundColor: newTheme.backgroundColor,
                        };

                        // If colorblind mode is enabled, adjust the colors
                        if (prevTheme.isColorblindMode) {
                          return {
                            ...baseTheme,
                            displayTextColor: adjustColorForColorblindness(
                              newTheme.textColor,
                              prevTheme.colorblindType,
                            ),
                            displayBackgroundColor:
                              adjustColorForColorblindness(
                                newTheme.backgroundColor,
                                prevTheme.colorblindType,
                              ),
                          };
                        }

                        // If colorblind mode is not enabled, use the original colors
                        return {
                          ...baseTheme,
                          displayTextColor: newTheme.textColor,
                          displayBackgroundColor: newTheme.backgroundColor,
                        };
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {visibilityStates.isTextColorVisible && (
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
        )}

        {visibilityStates.isBackgroundColorVisible && (
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
        )}

        {visibilityStates.isAccessibilityVisible && (
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
        )}

        {visibilityStates.isBackgroundThemeVisible && (
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
        )}
      </div>

      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="settings" // Set the tour name
      />
    </div>
  );
};

export default Settings;
