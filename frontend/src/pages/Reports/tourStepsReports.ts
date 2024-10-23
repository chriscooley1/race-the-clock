import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".reports", // Target the main container
    content: "View your reports here.",
    disableBeacon: true,
  },
  {
    target: "h1.mb-8", // Target the main title
    content: "This is the Reports page where you can monitor user performance.",
  },
  {
    target: ".reports-overview", // Target the Reports Overview component
    content: "This section provides an overview of user performance after each session.",
  },
  {
    target: ".reports-overview p", // Target the description in the Reports Overview
    content: "Detailed reports include total items shown, time taken, missed items, and skipped items.",
  },
  // Add more steps as needed
];
