import { Step } from "react-joyride";

// Define the visibility states interface
export interface VisibilityStates {
  isTimedChallengesVisible: boolean;
  isCollectionsOverviewVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".timed-challenges", // Target the main container
      content: "Participate in timed challenges here.",
      disableBeacon: true,
      ...(visibilityStates.isTimedChallengesVisible ? { isOpen: true } : {}),
    },
    {
      target: "h1.mb-8", // Target the main title
      content: "This is the Timed Challenges page where you can test your skills.",
      ...(visibilityStates.isCollectionsOverviewVisible ? { isOpen: true } : {}),
    },
    {
      target: ".collections-overview", // Target the collections overview component
      content: "Here are your collections for the timed challenges.",
      ...(visibilityStates.isCollectionsOverviewVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".timed-challenges") return visibilityStates.isTimedChallengesVisible;
    if (step.target === ".collections-overview") return visibilityStates.isCollectionsOverviewVisible;
    return true; // Include all other steps
  });
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
