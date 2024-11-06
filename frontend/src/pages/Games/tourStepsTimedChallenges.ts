import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsTimedChallenges = (): Step[] => {
  const steps: Step[] = [
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
  ];

  // Return all steps without filtering
  return steps;
};
