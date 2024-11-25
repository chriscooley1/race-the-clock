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
      content: "Each card represents one of your collections. You can start, edit, or delete a collection from here.",
      ...(visibilityStates.isCollectionCardVisible ? { isOpen: true } : {}),
    },
    {
      target: ".start-collection-button",
      content: "Click here to start a session with this collection.",
      ...(visibilityStates.isStartCollectionButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".edit-collection-button",
      content: "Use this button to modify the contents of your collection.",
      ...(visibilityStates.isEditCollectionButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".delete-collection-button",
      content: "Remove a collection you no longer need.",
      ...(visibilityStates.isDeleteCollectionButtonVisible ? { isOpen: true } : {}),
    }
  ];

  // Only include steps for visible elements
  return steps.filter((step) => {
    const target = step.target as string;
    if (target === ".collection-card") return visibilityStates.isCollectionCardVisible;
    if (target === ".start-collection-button") return visibilityStates.isStartCollectionButtonVisible;
    if (target === ".edit-collection-button") return visibilityStates.isEditCollectionButtonVisible;
    if (target === ".delete-collection-button") return visibilityStates.isDeleteCollectionButtonVisible;
    return true;
  });
};
