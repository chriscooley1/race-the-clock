import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".badges-achievements", // Target the main container
    content: "Check your badges and achievements here.",
    disableBeacon: true,
  },
  {
    target: ".badges-section", // Target the badges section
    content: "This section lists all your earned badges.",
  },
  {
    target: ".achievements-section", // Target the achievements section
    content: "This section lists all your completed achievements.",
  },
  {
    target: "h1.mb-8", // Target the main title
    content: "This is the Badges & Achievements page where you can track progress.",
  },
  {
    target: ".loading-message", // Target the loading message
    content: "This message appears while your badges and achievements are loading.",
    placement: "bottom", // Optional: specify placement
  },
  // Add more steps as needed
];
