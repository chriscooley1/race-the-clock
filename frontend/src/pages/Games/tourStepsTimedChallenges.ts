import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsTimedChallenges = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8", // Target the main title
      content: "This is the Timed Challenges page where you can test your skills.",
      disableBeacon: true,
    },
    {
      target: ".collections-overview", // Target the collections overview component
      content: "Here are your collections for the timed challenges.",
    },
  ];

  return steps;
};
