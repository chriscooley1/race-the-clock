import { Step } from "react-joyride";

export const tourStepsSettings = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".settings",
      content: "Adjust your settings here.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".main-font",
      content: "Select your main font from this dropdown.",
    },
    {
      target: ".heading-font",
      content: "Choose a font for your headings.",
    },
    {
      target: ".button-font",
      content: "Select a font for your buttons.",
    },
    {
      target: ".color-theme",
      content: "Choose a color theme for the application.",
    },
    {
      target: ".text-color",
      content: "Select a text color for the Full Screen Display.",
    },
    {
      target: ".accessibility",
      content: "Enable colorblind mode and select the type.",
    },
    {
      target: ".background-theme",
      content: "Select a background theme for the application.",
    },
  ].filter(Boolean) as Step[];

  return steps;
};
