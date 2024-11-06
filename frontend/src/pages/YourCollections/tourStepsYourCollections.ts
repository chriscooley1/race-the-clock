import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

export const tourStepsYourCollections = (
  visibilityStates: VisibilityStates,
): Step[] => {
  const steps: Step[] = [
    {
      target: ".your-collections-page",
      content: "This is where you can view and manage all your collections.",
      disableBeacon: true,
    },
    {
      target: ".collection-card",
      content:
        "Each card represents one of your collections. You can start, edit, or delete a collection from here.",
      ...(visibilityStates.isCollectionCardVisible ? { isOpen: true } : {}),
    },
    {
      target: ".start-collection-button",
      content: "Click here to start a session with this collection.",
      ...(visibilityStates.isStartCollectionButtonVisible
        ? { isOpen: true }
        : {}),
    },
    {
      target: ".edit-collection-button",
      content: "Use this button to modify the contents of your collection.",
      ...(visibilityStates.isEditCollectionButtonVisible
        ? { isOpen: true }
        : {}),
    },
    {
      target: ".delete-collection-button",
      content: "Remove a collection you no longer need.",
      ...(visibilityStates.isDeleteCollectionButtonVisible
        ? { isOpen: true }
        : {}),
    },
    {
      target: ".session-settings-modal",
      content: "Configure your session settings here before starting.",
      ...(visibilityStates.isSessionSettingsModalVisible ? { isOpen: true } : {}),
    },
    {
      target: ".edit-collection-modal",
      content: "Edit your collection details in this modal.",
      ...(visibilityStates.isEditCollectionModalVisible ? { isOpen: true } : {}),
    },
    {
      target: ".duplicate-collection-modal",
      content: "Use this modal to duplicate an existing collection.",
      ...(visibilityStates.isDuplicateCollectionModalVisible ? { isOpen: true } : {}),
    },
  ];

  return steps.filter((step) => {
    if (step.target === ".collection-card")
      return visibilityStates.isCollectionCardVisible;
    if (step.target === ".start-collection-button")
      return visibilityStates.isStartCollectionButtonVisible;
    if (step.target === ".edit-collection-button")
      return visibilityStates.isEditCollectionButtonVisible;
    if (step.target === ".delete-collection-button")
      return visibilityStates.isDeleteCollectionButtonVisible;
    if (step.target === ".session-settings-modal")
      return visibilityStates.isSessionSettingsModalVisible;
    if (step.target === ".edit-collection-modal")
      return visibilityStates.isEditCollectionModalVisible;
    if (step.target === ".duplicate-collection-modal")
      return visibilityStates.isDuplicateCollectionModalVisible;
    return true; // Include all other steps
  });
};
