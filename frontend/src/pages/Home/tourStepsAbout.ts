import { Step } from "react-joyride";

export const tourStepsAbout = (): Step[] => {
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
    },
    {
      target: "section.bg-white:nth-of-type(2) h2",
      content: "Explore our features that enhance your learning experience.",
    },
    {
      target: "section.bg-white:nth-of-type(3) h2",
      content: "Stay tuned for upcoming features that will be available soon!",
    },
    {
      target: "ul.space-y-4",
      content: "Check out the exciting upcoming features we have planned.",
    }
  ];

  return steps;
};
