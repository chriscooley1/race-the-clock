import { Step } from "react-joyride";

export const tourStepsFullScreenDisplay = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".full-screen-display", // Target the main display area
      content:
        "This is the full screen display where you can view your content.",
      disableBeacon: true,
    },
    {
      target: ".next-button", // Target the next button
      content: "Click here to go to the next item.",
    },
    {
      target: ".previous-button", // Target the previous button
      content: "Click here to go back to the previous item.",
    },
    {
      target: ".progress-indicator", // Target the progress indicator
      content: "This shows your progress through the items.",
    },
    {
      target: ".pause-button", // Target the pause button (if applicable)
      content: "Use this button to pause the display.",
    },
    {
      target: ".screen-click-area", // Target the main screen click area
      content: "Click anywhere on the screen to toggle the answer display.",
    },
  ];

  // Return all steps without filtering
  return steps;
};
