import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".new-collection-page", // Target the main container
    content: "Create a new collection here. Fill in the details below.",
    disableBeacon: true,
  },
  {
    target: ".collection-name-input", // Ensure this class exists in your component
    content: "Enter the name of your new collection here.",
  },
  {
    target: ".collection-description-input", // Target the description input
    content: "Provide a brief description of your collection.",
  },
  {
    target: ".submit-collection-button", // Target the submit button
    content: "Click here to create your new collection.",
  },
  // Add more steps as needed
];
