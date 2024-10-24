import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".settings", // Target the main container
    content: "Adjust your settings here.",
    disableBeacon: true,
  },
  {
    target: ".main-font", // Target the Main Font section header
    content: "Select your main font from this dropdown.",
  },
  {
    target: ".heading-font", // Target the Heading Font section header
    content: "Choose a font for your headings.",
  },
  {
    target: ".button-font", // Target the Button Font section header
    content: "Select a font for your buttons.",
  },
  {
    target: ".color-theme", // Target the Color Theme section header
    content: "Choose a color theme for the application.",
  },
  {
    target: ".text-color", // Target the Text Color section header
    content: "Select a text color for the Full Screen Display.",
  },
  {
    target: ".background-color", // Target the Background Color section header
    content: "Choose a background color for the Full Screen Display.",
  },
  {
    target: ".accessibility", // Target the Accessibility section header
    content: "Enable colorblind mode and select the type.",
  },
  {
    target: ".background-theme", // Target the Background Theme section header
    content: "Select a background theme for the application.",
  },
  // Add more steps as needed
];
