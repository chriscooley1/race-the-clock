import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".collection-final-step", // Target the main container
    content: "This is the final step for your collection. Review your items before saving.",
    disableBeacon: true,
  },
  {
    target: ".save-collection-button", // Target the save button
    content: "Click here to save your collection.",
  },
  {
    target: ".item-preview", // Target an item preview
    content: "This is a preview of the items in your collection.",
  },
  // Add more steps as needed
];
