import { Step } from "react-joyride";

// Define the visibility states interface
export interface VisibilityStates {
  isRegisterButtonVisible: boolean;
  isLoginButtonVisible: boolean;
}

// Function to create tour steps based on visibility states
export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".box-border", // Target the main container
      content:
        "Welcome to Race The Clock! This is the landing page where you can register or log in.",
      disableBeacon: true,
    },
    {
      target: ".register-button", // Target the Register button
      content: "Click here to register for a new account.",
      ...(visibilityStates.isRegisterButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".already-registered-button", // Target the Already Registered button
      content: "If you already have an account, click here to log in.",
      ...(visibilityStates.isLoginButtonVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === ".register-button") return visibilityStates.isRegisterButtonVisible;
    if (step.target === ".already-registered-button") return visibilityStates.isLoginButtonVisible;
    return true; // Include all other steps
  });
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
