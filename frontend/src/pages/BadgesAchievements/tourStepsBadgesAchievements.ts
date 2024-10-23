import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".badges-achievements", // Target the main container
    content: "Check your badges and achievements here.",
    disableBeacon: true,
  },
  {
    target: ".badges-achievements-overview", // Target the overview component
    content: "This section provides an overview of your badges and achievements.",
  },
  {
    target: "h1.mb-8", // Target the main title
    content: "This is the Badges & Achievements page where you can track progress.",
  },
  // Add more steps as needed
];
