import { Step } from "react-joyride";

export const tourStepsAbout = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "This is the About page where you can learn more about our platform.",
      disableBeacon: true,
    },
    {
      target: ".mission-statement",
      content: "Learn about our mission and vision.",
    },
    {
      target: ".team-section",
      content: "Meet our dedicated team members.",
    },
    {
      target: ".contact-info",
      content: "Find out how to get in touch with us.",
    },
    {
      target: ".footer",
      content: "Check out our social media links and additional resources.",
    }
  ];

  return steps;
};
