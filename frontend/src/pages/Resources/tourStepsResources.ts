import { Step } from "react-joyride";

export interface VisibilityStates {
  isFAQSectionVisible: boolean;
  isInstructionalVideosVisible: boolean;
}

export const createTourSteps = (visibilityStates: VisibilityStates): Step[] => {
  const steps: Step[] = [
    {
      target: ".resources", // Target the main container
      content: "Find helpful resources here.",
      disableBeacon: true,
    },
    {
      target: ".mb-8 h2", // Target the FAQ section header
      content: "This section contains frequently asked questions.",
      ...(visibilityStates.isFAQSectionVisible ? { isOpen: true } : {}),
    },
    {
      target: ".space-y-4 > div:nth-child(1)", // Target the first FAQ item
      content: "Here is the answer to the first question.",
      ...(visibilityStates.isFAQSectionVisible ? { isOpen: true } : {}),
    },
    {
      target: ".space-y-4 > div:nth-child(2)", // Target the second FAQ item
      content: "Here is the answer to the second question.",
      ...(visibilityStates.isFAQSectionVisible ? { isOpen: true } : {}),
    },
    {
      target: ".max-w-3xl h2:nth-of-type(2)", // Target the Instructional Videos section header
      content: "Watch instructional videos to learn more about the features.",
      ...(visibilityStates.isInstructionalVideosVisible ? { isOpen: true } : {}),
    },
    {
      target: ".space-y-6 > div:nth-child(1)", // Target the first instructional video item
      content: "Learn about the Your Collections page.",
      ...(visibilityStates.isInstructionalVideosVisible ? { isOpen: true } : {}),
    },
    {
      target: ".space-y-6 > div:nth-child(2)", // Target the second instructional video item
      content: "Discover how to use the Discover Collections page.",
      ...(visibilityStates.isInstructionalVideosVisible ? { isOpen: true } : {}),
    },
    {
      target: ".space-y-6 > div:nth-child(3)", // Target the third instructional video item
      content: "Get a guide on how to use the Name Generator feature.",
      ...(visibilityStates.isInstructionalVideosVisible ? { isOpen: true } : {}),
    },
  ];

  return steps.filter((step) => {
    if (step.target === ".mb-8 h2") return visibilityStates.isFAQSectionVisible;
    if (step.target === ".space-y-6 > div:nth-child(1)") return visibilityStates.isInstructionalVideosVisible;
    return true; // Include all other steps
  });
};

export const tourSteps = (visibilityStates: VisibilityStates) => createTourSteps(visibilityStates);
