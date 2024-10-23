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
  {
    target: "#first-number-select", // Target the first number select
    content: "Select the first number for your math problem.",
  },
  {
    target: "#operator-select", // Target the operator select
    content: "Choose the operator for your math problem.",
  },
  {
    target: "#second-number-select", // Target the second number select
    content: "Select the second number for your math problem.",
  },
  {
    target: ".add-math-problem-button", // Target the add math problem button
    content: "Click here to add a math problem to your collection.",
  },
  {
    target: ".add-dot-button", // Target the add dot button
    content: "Add dots to represent number sense items.",
  },
  {
    target: ".add-image-button", // Target the add image button
    content: "Upload images to include in your collection.",
  },
  {
    target: ".remove-item-button", // Target the remove item button
    content: "Click here to remove an item from your collection.",
  },
  {
    target: ".add-image-item-button", // Target the add image item button
    content: "Add uploaded images to your collection.",
  },
  // Add more steps as needed
];
