import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsResources = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "Find helpful resources here.",
      disableBeacon: true,
    },
    {
      target: "section:nth-of-type(1) h2", // Target the FAQ section header more specifically
      content: "This section contains frequently asked questions.",
    },
    {
      target: ".space-y-4 > div:nth-child(1)", // Target the first FAQ item
      content: "Here is the answer to the first question.",
    },
    {
      target: ".space-y-4 > div:nth-child(2)", // Target the second FAQ item
      content: "Here is the answer to the second question.",
    },
    {
      target: "section:nth-of-type(2) h2", // Target the Instructional Videos section header more specifically
      content: "Watch instructional videos to learn more about the features.",
    },
    {
      target: ".space-y-6 > div:nth-child(1)", // Target the first video item
      content: "Learn about the Your Collections page.",
    },
    {
      target: ".space-y-6 > div:nth-child(2)", // Target the second video item
      content: "Discover how to use the Discover Collections page.",
    },
    {
      target: ".space-y-6 > div:nth-child(3)", // Target the third video item
      content: "Get a guide on how to use the Name Generator feature.",
    },
  ];

  return steps; // Return all steps without filtering
};
