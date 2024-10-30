import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

export const tourStepsMyAccount = (
  visibilityStates: VisibilityStates,
): Step[] => {
  const steps: Step[] = [
    {
      target: ".my-account", // Target the main container
      content: "Manage your account details here.",
      disableBeacon: true,
    },
    {
      target: ".user-profile", // Target the user profile section
      content: "This section displays your profile information.",
      ...(visibilityStates.isProfileVisible ? { isOpen: true } : {}),
    },
    {
      target: ".update-display-name-form", // Target the update display name form
      content: "Use this form to update your display name.",
      ...(visibilityStates.isUpdateFormVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".user-profile")
      return visibilityStates.isProfileVisible;
    if (step.target === ".update-display-name-form")
      return visibilityStates.isUpdateFormVisible;
    return true; // Include all other steps
  });
};
