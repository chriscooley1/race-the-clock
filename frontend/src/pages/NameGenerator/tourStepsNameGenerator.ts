import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

// Function to create tour steps based on visibility states
export const tourStepsNameGenerator = (
  visibilityStates: VisibilityStates,
): Step[] => {
  const steps: Step[] = [
    {
      target: ".name-generator", // Target the main container
      content: "Generate names for your collections here.",
      disableBeacon: true,
    },
    {
      target: "#nameInput", // Target the name input field
      content: "Enter a name to add to the list.",
      ...(visibilityStates.isNameInputVisible ? { isOpen: true } : {}),
    },
    {
      target: ".add-name-button", // Target the add name button
      content: "Click here to add the name to the list.",
      ...(visibilityStates.isAddNameButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".spin-button", // Target the spin button
      content: "Click to spin the wheel and generate a random name.",
      ...(visibilityStates.isSpinButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".names-list", // Target the names list
      content: "Here are the names on the wheel.",
      ...(visibilityStates.isNamesListVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === "#nameInput")
      return visibilityStates.isNameInputVisible;
    if (step.target === ".add-name-button")
      return visibilityStates.isAddNameButtonVisible;
    if (step.target === ".spin-button")
      return visibilityStates.isSpinButtonVisible;
    if (step.target === ".names-list")
      return visibilityStates.isNamesListVisible;
    return true; // Include all other steps
  });
};
