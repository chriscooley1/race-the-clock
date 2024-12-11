import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsMyAccount = (): Step[] => {
  const steps: Step[] = [
    {
      target: ".my-account",
      content: "Manage your account details here.",
      disableBeacon: true,
    },
    {
      target: ".user-profile",
      content: "This section displays your profile information.",
    },
    {
      target: ".update-display-name-form",
      content: "Use this form to update your display name.",
    },
    {
      target: ".role-selection",
      content:
        "Choose your role as either a teacher or student. Teachers can create and manage collections, while students can practice with assigned collections.",
    },
    {
      target: ".role-features",
      content: "View the features available for your selected role.",
    },
  ];

  return steps;
};
