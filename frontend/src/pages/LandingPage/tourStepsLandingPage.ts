import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".box-border", // Target the main container
    content:
      "Welcome to Race The Clock! This is the landing page where you can register or log in.",
    disableBeacon: true,
  },
  {
    target: ".bg-light-blue", // Target the Register button
    content: "Click here to register for a new account.",
  },
  {
    target: ".bg-light-blue + .bg-light-blue", // Target the Already Registered button
    content: "If you already have an account, click here to log in.",
  },
  // Add more steps as needed
];
