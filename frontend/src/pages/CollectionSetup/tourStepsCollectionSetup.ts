import { Step } from "react-joyride";

// Define the type for visibility states
export interface VisibilityStates {
  isDotCountTypeVisible: boolean;
  isMinDotsVisible: boolean;
  isMaxDotsVisible: boolean;
  isTypeSelectVisible: boolean;
  isItemCountVisible: boolean;
  isCollectionItemCountVisible: boolean;
  isDotColorVisible: boolean;
  isDotShapeVisible: boolean;
  isGenerateRandomSequenceButtonVisible: boolean;
  isFileUploadVisible: boolean;
  isNextButtonVisible: boolean;
  isClearButtonVisible: boolean;
  isGeneratedSequencePreviewVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".collection-setup",
      content: "Set up your collection here. Fill in the necessary details.",
      disableBeacon: true,
    },
    {
      target: "#dotCountType",
      content: "Choose whether the dot count should be fixed or random.",
      ...(visibilityStates.isDotCountTypeVisible ? { isOpen: true } : {}),
    },
    {
      target: "#typeSelect",
      content:
        "Select the type of items you want to include in your collection.",
      ...(visibilityStates.isTypeSelectVisible ? { isOpen: true } : {}),
    },
    {
      target: "#itemCount",
      content: "Specify the quantity of items you want to generate.",
      ...(visibilityStates.isItemCountVisible ? { isOpen: true } : {}),
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
      ...(visibilityStates.isCollectionItemCountVisible
        ? { isOpen: true }
        : {}),
    },
    {
      target: "#dot-color",
      content: "Select the color for your dots.",
      ...(visibilityStates.isDotColorVisible ? { isOpen: true } : {}),
    },
    {
      target: "#dot-shape",
      content: "Choose the shape for your dots.",
      ...(visibilityStates.isDotShapeVisible ? { isOpen: true } : {}),
    },
    {
      target: ".generate-random-sequence-button",
      content: "Click here to generate a random sequence of items.",
      ...(visibilityStates.isGenerateRandomSequenceButtonVisible
        ? { isOpen: true }
        : {}),
    },
    {
      target: "#fileUpload",
      content: "Upload a file to include items in your collection.",
      ...(visibilityStates.isFileUploadVisible ? { isOpen: true } : {}),
    },
    {
      target: ".next-button",
      content: "Proceed to the final step by clicking here.",
      ...(visibilityStates.isNextButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".clear-button",
      content: "Click here to clear the current setup and start over.",
      ...(visibilityStates.isClearButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".generated-sequence-preview",
      content: "Preview the generated sequence of items before saving.",
      ...(visibilityStates.isGeneratedSequencePreviewVisible
        ? { isOpen: true }
        : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".dot-count-type")
      return visibilityStates.isDotCountTypeVisible;
    if (step.target === "#minDots") return visibilityStates.isMinDotsVisible;
    if (step.target === "#maxDots") return visibilityStates.isMaxDotsVisible;
    if (step.target === "#typeSelect")
      return visibilityStates.isTypeSelectVisible;
    if (step.target === "#itemCount")
      return visibilityStates.isItemCountVisible;
    if (step.target === "#collectionItemCount")
      return visibilityStates.isCollectionItemCountVisible;
    if (step.target === "#dot-color") return visibilityStates.isDotColorVisible;
    if (step.target === "#dot-shape") return visibilityStates.isDotShapeVisible;
    if (step.target === ".generate-random-sequence-button")
      return visibilityStates.isGenerateRandomSequenceButtonVisible;
    if (step.target === "#fileUpload")
      return visibilityStates.isFileUploadVisible;
    if (step.target === ".next-button")
      return visibilityStates.isNextButtonVisible;
    if (step.target === ".clear-button")
      return visibilityStates.isClearButtonVisible;
    if (step.target === ".generated-sequence-preview")
      return visibilityStates.isGeneratedSequencePreviewVisible;
    return true; // Include all other steps
  });
};

// Export a constant that uses the function
export const tourSteps = (visibilityStates: VisibilityStates) =>
  createTourSteps(visibilityStates);

// You may need to export a function to initialize the tour with the visibility states
export const initializeTour = (visibilityStates: VisibilityStates) => {
  // Use visibilityStates to create tour steps
  return createTourSteps(visibilityStates);
};
