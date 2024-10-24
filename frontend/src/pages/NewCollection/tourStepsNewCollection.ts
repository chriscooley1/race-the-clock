import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".new-collection-page", // Target the main container
    content: "Create a new collection here. Fill in the details below.",
    disableBeacon: true,
  },
  {
    target: ".collection-name-input", // Target the collection name input
    content: "Enter the name of your new collection here.",
  },
  {
    target: ".collection-description-input", // Target the description input
    content: "Provide a brief description of your collection.",
  },
  {
    target: "#categorySelect", // Target the category selection dropdown
    content: "Select a category for your collection.",
  },
  {
    target: "#stageSelect", // Target the stage selection dropdown
    content: "Choose the stage of your collection.",
  },
  {
    target: "#publicCheckbox", // Target the public checkbox
    content: "Check this box if you want to share your collection publicly.",
  },
  {
    target: ".submit-collection-button", // Target the submit button
    content: "Click here to create your new collection.",
  },
  // Add more steps as needed
];
