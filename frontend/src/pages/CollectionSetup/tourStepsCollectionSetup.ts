import { Step } from "react-joyride";

// Define the type for visibility states
export interface VisibilityStates {
  isDotCountTypeVisible: boolean;
  isMinDotsVisible: boolean;
  isMaxDotsVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  return [
    {
      target: ".collection-setup",
      content: "Set up your collection here. Fill in the necessary details.",
      disableBeacon: true,
    },
    {
      target: ".dot-count-type",
      content: "Choose whether the dot count should be fixed or random.",
      ...(visibilityStates.isDotCountTypeVisible ? { isOpen: true } : {}),
    },
    {
      target: "#typeSelect",
      content: "Select the type of items you want to include in your collection.",
    },
    {
      target: "#itemCount",
      content: "Specify the quantity of items you want to generate.",
    },
    {
      target: "#minDots",
      content: "Set the minimum number of dots if you chose random count.",
      ...(visibilityStates.isMinDotsVisible ? { isOpen: true } : {}),
    },
    {
      target: "#maxDots",
      content: "Set the maximum number of dots if you chose random count.",
      ...(visibilityStates.isMaxDotsVisible ? { isOpen: true } : {}),
    },
    {
      target: "#collectionItemCount",
      content: "Define how many items will be included in the collection.",
    },
    {
      target: ".dot-color",
      content: "Select the color for your dots.",
    },
    {
      target: ".dot-shape",
      content: "Choose the shape for your dots.",
    },
    {
      target: ".generate-random-sequence-button",
      content: "Click here to generate a random sequence of items.",
    },
    {
      target: "#fileUpload",
      content: "Upload a file to include items in your collection.",
    },
    {
      target: ".next-button",
      content: "Proceed to the final step by clicking here.",
    },
    {
      target: ".clear-button",
      content: "Click here to clear the current setup and start over.",
    },
    {
      target: ".generated-sequence-preview",
      content: "Preview the generated sequence of items before saving.",
    },
    // Add more steps as needed
  ];
};

// Export a constant that uses the function
export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);

// You may need to export a function to initialize the tour with the visibility states
export const initializeTour = (visibilityStates: VisibilityStates) => {
  // Use visibilityStates to create tour steps
  return createTourSteps(visibilityStates);
};
