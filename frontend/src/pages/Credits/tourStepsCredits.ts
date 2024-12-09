import { Step } from "react-joyride";

export const tourStepsCredits = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8",
      content: "This is the Credits page where you can see acknowledgments.",
      disableBeacon: true,
    },
    {
      target: ".max-w-2xl",
      content: "Here you can find a special thanks to contributors.",
    },
    {
      target: ".text-lg",
      content: "This section provides information about the website creators.",
    },
  ];

  return steps;
};
