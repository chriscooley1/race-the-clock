import { Step } from "react-joyride";

export const tourStepsMatchingGame = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".matching-game-container",
      content: "Welcome to the Matching Game!",
      disableBeacon: true,
    },
    {
      target: ".game-instructions",
      content: "Match letters with their corresponding images to win.",
    },
    {
      target: ".game-board",
      content: "Click on matching pairs to connect them.",
    },
    {
      target: ".start-button",
      content: "Click here to start the game!",
    }
  ];

  return steps;
}; 