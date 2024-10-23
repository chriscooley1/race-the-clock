import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".timed-challenges", // Target the main container
    content: "Participate in timed challenges here.",
    disableBeacon: true,
  },
  {
    target: "h1.mb-8", // Target the main title
    content: "This is the Timed Challenges page where you can test your skills.",
  },
  {
    target: ".timed-challenge-game", // Target the Timed Challenge Game component
    content: "Complete as many challenges as you can within the time limit!",
  },
  // Add more steps as needed
];
