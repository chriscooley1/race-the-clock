import { Step } from "react-joyride";

export const tourStepsMultipleWords = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".multiple-words-container",
      content: "Welcome to the Multiple Words Game!",
      disableBeacon: true,
    },
    {
      target: ".game-instructions",
      content: "Connect words to their matching cards by dragging them.",
    },
  ];

  return steps;
};
