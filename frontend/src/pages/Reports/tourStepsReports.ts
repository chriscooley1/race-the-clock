import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsReports = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".reports", // Target the main container
      content: "View your reports here.",
      disableBeacon: true,
    },
    {
      target: "h1.mb-8", // Target the main title
      content:
        "This is the Reports page where you can monitor user performance.",
    },
    {
      target: ".reports-overview", // Target the Reports Overview component
      content:
        "This section provides an overview of user performance after each session.",
    },
    {
      target: ".reports-overview ul", // Target the reports list
      content: "Here you can see the detailed reports.",
    },
  ];

  // Return all steps without filtering
  return steps;
};
