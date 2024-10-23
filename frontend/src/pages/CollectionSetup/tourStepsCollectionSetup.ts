import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".collection-setup", // Target the main container
    content: "Set up your collection here. Fill in the necessary details.",
    disableBeacon: true,
  },
  {
    target: ".dot-color", // Target the dot color selection
    content: "Select the color for your dots.",
  },
  {
    target: ".dot-shape", // Target the dot shape selection
    content: "Choose the shape for your dots.",
  },
  {
    target: ".generate-random-sequence-button", // Target the generate button
    content: "Click here to generate a random sequence.",
  },
  {
    target: ".next-button", // Target the next button
    content: "Proceed to the final step by clicking here.",
  },
  // Add more steps as needed
];
