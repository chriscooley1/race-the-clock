import { Step } from "react-joyride";

export const tourStepsHome = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1",
      content: "Welcome to Race The Clock! Let's take a quick tour of the home page.",
      disableBeacon: true,
    },
    {
      target: ".top-navbar-height",
      content: "Use this navigation bar to explore different sections of the site.",
    },
    {
      target: "button[onClick*='/login']",
      content: "Click here to log in and access all features.",
    },
    {
      target: "section:first-of-type",
      content: "Learn about who can benefit from Race The Clock and its origins.",
    },
    {
      target: ".grid",
      content: "Discover our key features, including custom collections, speed controls, and more.",
    }
  ];

  return steps;
};
