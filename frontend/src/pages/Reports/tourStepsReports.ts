import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsReports = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "This is the Reports page where you can monitor user performance.",
      disableBeacon: true,
    },
    {
      target: ".reports",
      content: "View your reports here.",
    },
    {
      target: ".reports-overview",
      content: "This section provides an overview of user performance after each session.",
    },
    {
      target: ".reports-overview ul",
      content: "Here you can see the detailed reports.",
    },
  ];

  // Return all steps without filtering
  return steps;
};
