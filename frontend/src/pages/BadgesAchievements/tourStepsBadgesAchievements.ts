import { Step } from "react-joyride";

export interface VisibilityStates {
  isBadgesSectionVisible: boolean;
  isAchievementsSectionVisible: boolean;
  isLoadingMessageVisible: boolean;
}

export const tourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".badges-achievements",
      content: "Check your badges and achievements here.",
      disableBeacon: true,
    },
    {
      target: ".badges-section",
      content: "This section lists all your earned badges.",
      ...(visibilityStates.isBadgesSectionVisible ? { isOpen: true } : {}),
    },
    {
      target: ".achievements-section",
      content: "This section lists all your completed achievements.",
      ...(visibilityStates.isAchievementsSectionVisible ? { isOpen: true } : {}),
    },
    {
      target: "h1.mb-8",
      content: "This is the Badges & Achievements page where you can track progress.",
    },
    {
      target: ".loading-message",
      content: "This message appears while your badges and achievements are loading.",
      ...(visibilityStates.isLoadingMessageVisible ? { isOpen: true } : {}),
    },
  ];

  return steps.filter((step) => {
    if (step.target === ".badges-section") return visibilityStates.isBadgesSectionVisible;
    if (step.target === ".achievements-section") return visibilityStates.isAchievementsSectionVisible;
    if (step.target === ".loading-message") return visibilityStates.isLoadingMessageVisible;
    return true;
  });
};
