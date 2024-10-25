import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".timed-challenges", // Target the main container
    content: "Participate in timed challenges here.",
    disableBeacon: true,
  },
  {
    target: "h1.mb-8", // Target the main title
    content:
      "This is the Timed Challenges page where you can test your skills.",
  },
  {
    target: ".collections-overview", // Target the collections overview component
    content: "Here are your collections for the timed challenges.",
  },
  // Add more steps as needed
];
