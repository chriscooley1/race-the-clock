import { Step } from "react-joyride";

export const tourStepsMatchingGame = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "Welcome to the Matching Game!",
      disableBeacon: true,
    },
    {
      target: ".game-instructions",
      content: "Match letters with their corresponding images to win.",
    },
    {
      target: ".start-button",
      content: "Click here to start the game!",
    },
  ];

  return steps;
};
