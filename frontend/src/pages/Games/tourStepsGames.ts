import { Step } from "react-joyride";

// Define the visibility states interface
export interface VisibilityStates {
  isMatchingGameVisible: boolean;
  isMultipleWordsGameVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".games", // Target the main container
      content: "Play games related to your collections here.",
      disableBeacon: true,
    },
    {
      target: "h1.mb-8", // Target the main title
      content: "This is the Games page where you can find various educational games.",
    },
    {
      target: ".matching-game", // Target the Matching Game component
      content: "Try the Matching Game to associate letters or words with images.",
      ...(visibilityStates.isMatchingGameVisible ? { isOpen: true } : {}),
    },
    {
      target: ".multiple-words-game", // Target the Multiple Words Game component
      content: "Play the Multiple Words Game to drag and connect words.",
      ...(visibilityStates.isMultipleWordsGameVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".matching-game") return visibilityStates.isMatchingGameVisible;
    if (step.target === ".multiple-words-game") return visibilityStates.isMultipleWordsGameVisible;
    return true; // Include all other steps
  });
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
