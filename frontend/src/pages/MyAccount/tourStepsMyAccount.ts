import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsMyAccount = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".my-account", // Target the main container
      content: "Manage your account details here.",
      disableBeacon: true,
    },
    {
      target: ".user-profile", // Target the user profile section
      content: "This section displays your profile information.",
    },
    {
      target: ".update-display-name-form", // Target the update display name form
      content: "Use this form to update your display name.",
    },
  ];

  // Return all steps without filtering
  return steps;
};
