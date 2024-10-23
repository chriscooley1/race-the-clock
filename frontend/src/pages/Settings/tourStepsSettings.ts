import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".settings", // Target the main container
    content: "Adjust your settings here.",
    disableBeacon: true,
  },
  {
    target: ".mb-8 h2:nth-of-type(1)", // Target the Main Font section header
    content: "Select your main font from this dropdown.",
  },
  {
    target: ".mb-8 h2:nth-of-type(2)", // Target the Heading Font section header
    content: "Choose a font for your headings.",
  },
  {
    target: ".mb-8 h2:nth-of-type(3)", // Target the Button Font section header
    content: "Select a font for your buttons.",
  },
  {
    target: ".mb-4 label:nth-of-type(1)", // Target the Color Theme section header
    content: "Choose a color theme for the application.",
  },
  {
    target: ".mb-4 label:nth-of-type(2)", // Target the Text Color section header
    content: "Select a text color for the Full Screen Display.",
  },
  {
    target: ".mb-4 label:nth-of-type(3)", // Target the Background Color section header
    content: "Choose a background color for the Full Screen Display.",
  },
  {
    target: ".mb-4 label:nth-of-type(4)", // Target the Accessibility section header
    content: "Enable colorblind mode and select the type.",
  },
  {
    target: ".mb-4 label:nth-of-type(5)", // Target the Background Theme section header
    content: "Select a background theme for the application.",
  },
  // Add more steps as needed
];
