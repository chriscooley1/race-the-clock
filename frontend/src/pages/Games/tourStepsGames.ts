import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".games", // Target the main container
    content: "Play games related to your collections here.",
    disableBeacon: true,
  },
  {
    target: "h1.mb-8", // Target the main title
    content:
      "This is the Games page where you can find various educational games.",
  },
  {
    target: ".matching-game", // Target the Matching Game component
    content: "Try the Matching Game to associate letters or words with images.",
  },
  {
    target: ".multiple-words-game", // Target the Multiple Words Game component
    content: "Play the Multiple Words Game to drag and connect words.",
  },
  // Add more steps as needed
];
