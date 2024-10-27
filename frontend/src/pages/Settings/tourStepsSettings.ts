import { Step } from "react-joyride";

export interface VisibilityStates {
  isMainFontVisible: boolean;
  isHeadingFontVisible: boolean;
  isButtonFontVisible: boolean;
  isColorThemeVisible: boolean;
  isTextColorVisible: boolean;
  isBackgroundColorVisible: boolean;
  isAccessibilityVisible: boolean;
  isBackgroundThemeVisible: boolean;
}

export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".settings", // Target the main container
      content: "Adjust your settings here.",
      disableBeacon: true,
    },
    visibilityStates.isMainFontVisible && {
      target: ".main-font", // Target the Main Font section header
      content: "Select your main font from this dropdown.",
    },
    visibilityStates.isHeadingFontVisible && {
      target: ".heading-font", // Target the Heading Font section header
      content: "Choose a font for your headings.",
    },
    visibilityStates.isButtonFontVisible && {
      target: ".button-font", // Target the Button Font section header
      content: "Select a font for your buttons.",
    },
    visibilityStates.isColorThemeVisible && {
      target: ".color-theme", // Target the Color Theme section header
      content: "Choose a color theme for the application.",
    },
    visibilityStates.isTextColorVisible && {
      target: ".text-color", // Target the Text Color section header
      content: "Select a text color for the Full Screen Display.",
    },
    visibilityStates.isBackgroundColorVisible && {
      target: ".background-color", // Target the Background Color section header
      content: "Choose a background color for the Full Screen Display.",
    },
    visibilityStates.isAccessibilityVisible && {
      target: ".accessibility", // Target the Accessibility section header
      content: "Enable colorblind mode and select the type.",
    },
    visibilityStates.isBackgroundThemeVisible && {
      target: ".background-theme", // Target the Background Theme section header
      content: "Select a background theme for the application.",
    },
  ].filter(Boolean) as Step[]; // Filter out any false values

  return steps;
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
