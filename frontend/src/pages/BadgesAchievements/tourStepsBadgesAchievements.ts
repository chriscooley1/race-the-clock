import { Step } from "react-joyride";

export const tourStepsBadgesAchievements = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "This is the Badges & Achievements page where you can track your progress.",
      disableBeacon: true,
    },
    {
      target: ".badges-section",
      content: "This section lists all your earned badges.",
    },
    {
      target: ".achievements-section",
      content: "This section lists all your completed achievements.",
    },
    {
      target: ".completion-counts-section",
      content: "Here you can see how many times you've completed each collection.",
    },
  ];

  return steps;
};
