import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".collection-setup", // Target the main container
    content: "Set up your collection here. Fill in the necessary details.",
    disableBeacon: true,
  },
  {
    target: "#typeSelect", // Target the type selection dropdown
    content: "Select the type of items you want to include in your collection.",
  },
  {
    target: "#itemCount", // Target the item count input
    content: "Specify the quantity of items you want to generate.",
  },
  {
    target: ".dot-count-type", // Target the dot count type selection
    content: "Choose whether the dot count should be fixed or random.",
  },
  {
    target: "#minDots", // Target the minimum dots input
    content: "Set the minimum number of dots if you chose random count.",
  },
  {
    target: "#maxDots", // Target the maximum dots input
    content: "Set the maximum number of dots if you chose random count.",
  },
  {
    target: "#collectionItemCount", // Target the number of items in collection input
    content: "Define how many items will be included in the collection.",
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
    content: "Click here to generate a random sequence of items.",
  },
  {
    target: "#fileUpload", // Target the file upload input
    content: "Upload a file to include items in your collection.",
  },
  {
    target: ".next-button", // Target the next button
    content: "Proceed to the final step by clicking here.",
  },
  {
    target: ".clear-button", // Target the clear button
    content: "Click here to clear the current setup and start over.",
  },
  {
    target: ".generated-sequence-preview", // Target the generated sequence preview section
    content: "Preview the generated sequence of items before saving.",
  },
  // Add more steps as needed
];
