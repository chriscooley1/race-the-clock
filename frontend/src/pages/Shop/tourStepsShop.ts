import { Step } from "react-joyride";

export const tourStepsShop = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "Welcome to our Shop! Browse through available items and features.",
      disableBeacon: true,
    }
  ];

  return steps;
};
