import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

// Function to create tour steps based on visibility states
export const tourStepsReports = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
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
      ...(visibilityStates.isReportsOverviewVisible ? { isOpen: true } : {}),
    },
    {
      target: ".reports-overview ul", // Target the reports list
      content: "Here you can see the detailed reports.",
      ...(visibilityStates.isReportsListVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".reports-overview") return visibilityStates.isReportsOverviewVisible;
    if (step.target === ".reports-overview ul") return visibilityStates.isReportsListVisible;
    return true; // Include all other steps
  });
};
