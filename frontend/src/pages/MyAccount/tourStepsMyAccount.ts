import { Step } from "react-joyride";

export const tourSteps: Step[] = [
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
  // Add more steps as needed
];
