import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

// Function to create tour steps based on visibility states
export const tourStepsNewCollection = (
  visibilityStates: VisibilityStates,
): Step[] => {
  const steps: Step[] = [
    {
      target: ".new-collection-page", // Target the main container
      content: "Create a new collection here. Fill in the details below.",
      disableBeacon: true,
    },
    {
      target: ".collection-name-input", // Updated selector to match the class
      content: "Enter the name of your new collection here.",
      ...(visibilityStates.isCollectionNameVisible ? { isOpen: true } : {}),
    },
    {
      target: "#categorySelect", // Target the category selection dropdown
      content: "Select a category for your collection.",
      ...(visibilityStates.isCategorySelectVisible ? { isOpen: true } : {}),
    },
    {
      target: "#publicCheckbox", // Target the public checkbox
      content: "Check this box if you want to share your collection publicly.",
      ...(visibilityStates.isPublicCheckboxVisible ? { isOpen: true } : {}),
    },
    {
      target: ".submit-collection-button", // Target the submit button
      content: "Click 'Next' to proceed with creating your collection.",
      ...(visibilityStates.isSubmitButtonVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    const target = step.target as string;
    if (target === ".collection-name-input")
      return visibilityStates.isCollectionNameVisible;
    if (target === "#categorySelect")
      return visibilityStates.isCategorySelectVisible;
    if (target === "#publicCheckbox")
      return visibilityStates.isPublicCheckboxVisible;
    if (target === ".submit-collection-button")
      return visibilityStates.isSubmitButtonVisible;
    return true; // Include all other steps
  });
};
