import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".name-generator", // Target the main container
    content: "Generate names for your collections here.",
    disableBeacon: true,
  },
  {
    target: "#nameInput", // Target the name input field
    content: "Enter a name to add to the list.",
  },
  {
    target: ".add-name-button", // Target the add name button
    content: "Click here to add the name to the list.",
  },
  {
    target: ".spin-button", // Target the spin button
    content: "Click to spin the wheel and generate a random name.",
  },
  // Add more steps as needed
];
