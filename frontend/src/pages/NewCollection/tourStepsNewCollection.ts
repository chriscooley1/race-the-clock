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
      target: "#collectionName", // Target the collection name input
      content: "Enter the name of your new collection here.",
      ...(visibilityStates.isCollectionNameVisible ? { isOpen: true } : {}),
    },
    {
      target: "#categorySelect", // Target the category selection dropdown
      content: "Select a category for your collection.",
      ...(visibilityStates.isCategorySelectVisible ? { isOpen: true } : {}),
    },
    {
      target: "#stageSelect", // Target the stage selection dropdown
      content: "Choose the stage of your collection.",
      ...(visibilityStates.isStageSelectVisible ? { isOpen: true } : {}),
    },
    {
      target: "#publicCheckbox", // Target the public checkbox
      content: "Check this box if you want to share your collection publicly.",
      ...(visibilityStates.isPublicCheckboxVisible ? { isOpen: true } : {}),
    },
    {
      target: ".submit-collection-button", // Target the submit button
      content: "Click here to create your new collection.",
      ...(visibilityStates.isSubmitButtonVisible ? { isOpen: true } : {}),
    },
  ];

  // Filter steps based on visibility states
  return steps.filter((step) => {
    if (step.target === "#collectionName")
      return visibilityStates.isCollectionNameVisible;
    if (step.target === "#categorySelect")
      return visibilityStates.isCategorySelectVisible;
    if (step.target === "#stageSelect")
      return visibilityStates.isStageSelectVisible;
    if (step.target === "#publicCheckbox")
      return visibilityStates.isPublicCheckboxVisible;
    if (step.target === ".submit-collection-button")
      return visibilityStates.isSubmitButtonVisible;
    return true; // Include all other steps
  });
};
