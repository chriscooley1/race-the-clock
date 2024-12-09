import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

export const tourStepsCollectionFinalStep = (
  visibilityStates: VisibilityStates,
): Step[] => {
  const steps: Step[] = [
    {
      target: ".collection-final-step",
      content: "This is the final step for your collection. Review your items before saving.",
      disableBeacon: true,
    },
    {
      target: ".save-collection-button",
      content: "Click here to save your collection.",
      ...(visibilityStates.isSaveButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".item-preview",
      content: "This is a preview of the items in your collection.",
      ...(visibilityStates.isItemPreviewVisible ? { isOpen: true } : {}),
    },
    {
      target: ".math-problem-section", // Example target for math problems
      content: "This section allows you to add math problems.",
      ...(visibilityStates.isMathProblemVisible ? { isOpen: true } : {}),
    },
    {
      target: ".dot-button", // Example target for dot button
      content: "Click here to add a dot.",
      ...(visibilityStates.isDotButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".image-upload-section", // Example target for image upload
      content: "Upload images for your collection here.",
      ...(visibilityStates.isImageUploadVisible ? { isOpen: true } : {}),
    },
  ];

  return steps.filter((step) => {
    if (step.target === ".save-collection-button")
      return visibilityStates.isSaveButtonVisible;
    if (step.target === ".item-preview")
      return visibilityStates.isItemPreviewVisible;
    if (step.target === ".math-problem-section")
      return visibilityStates.isMathProblemVisible;
    if (step.target === ".dot-button")
      return visibilityStates.isDotButtonVisible;
    if (step.target === ".image-upload-section")
      return visibilityStates.isImageUploadVisible;
    return true; // Include all other steps
  });
};
