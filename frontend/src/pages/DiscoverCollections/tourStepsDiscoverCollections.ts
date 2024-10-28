import { Step } from "react-joyride";

export interface VisibilityStates {
  isSearchInputVisible: boolean;
  isSortSelectVisible: boolean;
  isCollectionsGridVisible: boolean;
  isPreviewButtonVisible: boolean;
}

export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".discover-collections-page",
      content: "Explore collections created by other users here.",
      disableBeacon: true,
    },
    {
      target: ".search-collections-input",
      content: "Search for specific collections by name or creator.",
      ...(visibilityStates.isSearchInputVisible ? { isOpen: true } : {}),
    },
    {
      target: "#sortSelect",
      content: "Change how the collections are sorted using this dropdown.",
      ...(visibilityStates.isSortSelectVisible ? { isOpen: true } : {}),
    },
    {
      target: ".grid",
      content: "Here are the collections available for you to explore.",
      ...(visibilityStates.isCollectionsGridVisible ? { isOpen: true } : {}),
    },
    {
      target: ".preview-collection-button",
      content: "Click to see more details about a collection and subscribe to it.",
      ...(visibilityStates.isPreviewButtonVisible ? { isOpen: true } : {}),
    },
  ];

  return steps.filter((step) => {
    if (step.target === ".search-collections-input") return visibilityStates.isSearchInputVisible;
    if (step.target === "#sortSelect") return visibilityStates.isSortSelectVisible;
    if (step.target === ".grid") return visibilityStates.isCollectionsGridVisible;
    if (step.target === ".preview-collection-button") return visibilityStates.isPreviewButtonVisible;
    return true; // Include all other steps
  });
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
