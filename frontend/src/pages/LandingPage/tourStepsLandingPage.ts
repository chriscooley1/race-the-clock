import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".box-border", // Target the main container
    content:
      "Welcome to Race The Clock! This is the landing page where you can register or log in.",
    disableBeacon: true,
  },
  {
    target: ".register-button", // Target the Register button
    content: "Click here to register for a new account.",
  },
  {
    target: ".already-registered-button", // Target the Already Registered button
    content: "If you already have an account, click here to log in.",
  },
  // Add more steps as needed
];
