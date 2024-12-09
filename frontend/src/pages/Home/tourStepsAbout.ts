import { Step } from "react-joyride";

export const tourStepsAbout = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "This is the About page where you can learn more about our platform.",
      disableBeacon: true,
    }
  ];

  return steps;
};
