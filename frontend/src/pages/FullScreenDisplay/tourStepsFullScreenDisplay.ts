import { Step } from "react-joyride";

export interface VisibilityStates {
  isNextButtonVisible: boolean;
  isPreviousButtonVisible: boolean;
  isProgressIndicatorVisible: boolean;
  isPauseButtonVisible: boolean;
  isScreenClickAreaVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".full-screen-display", // Target the main display area
      content: "This is the full screen display where you can view your content.",
      disableBeacon: true,
    },
    {
      target: ".next-button", // Target the next button
      content: "Click here to go to the next item.",
      ...(visibilityStates.isNextButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".previous-button", // Target the previous button
      content: "Click here to go back to the previous item.",
      ...(visibilityStates.isPreviousButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".progress-indicator", // Target the progress indicator
      content: "This shows your progress through the items.",
      ...(visibilityStates.isProgressIndicatorVisible ? { isOpen: true } : {}),
    },
    {
      target: ".pause-button", // Target the pause button (if applicable)
      content: "Use this button to pause the display.",
      ...(visibilityStates.isPauseButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".screen-click-area", // Target the main screen click area
      content: "Click anywhere on the screen to toggle the answer display.",
      ...(visibilityStates.isScreenClickAreaVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".next-button") return visibilityStates.isNextButtonVisible;
    if (step.target === ".previous-button") return visibilityStates.isPreviousButtonVisible;
    if (step.target === ".progress-indicator") return visibilityStates.isProgressIndicatorVisible;
    if (step.target === ".pause-button") return visibilityStates.isPauseButtonVisible;
    if (step.target === ".screen-click-area") return visibilityStates.isScreenClickAreaVisible;
    return true; // Include all other steps
  });
};

// If you want to export a tourSteps variable, you can define it here
export const tourSteps = createTourSteps({
  isNextButtonVisible: true,
  isPreviousButtonVisible: true,
  isProgressIndicatorVisible: true,
  isPauseButtonVisible: true,
  isScreenClickAreaVisible: true,
});
