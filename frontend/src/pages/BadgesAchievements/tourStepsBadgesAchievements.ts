import { Step } from "react-joyride";

export const tourStepsBadgesAchievements = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".badges-achievements",
      content: "Check your badges and achievements here.",
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
      target: "h1.mb-8",
      content:
        "This is the Badges & Achievements page where you can track progress.",
    },
  ];

  return steps;
};
