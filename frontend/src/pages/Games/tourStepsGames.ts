import { Step } from "react-joyride";

// Function to create tour steps without visibility states
export const tourStepsGames = (): Step[] => {
  const steps: Step[] = [
    {
      target: "h1.mb-8", // Target the main title
      content:
        "This is the Games page where you can find various educational games.",
      disableBeacon: true,
    },
    {
      target: ".matching-game", // Target the Matching Game component
      content:
        "Try the Matching Game to associate letters or words with images.",
    },
    {
      target: ".multiple-words-game", // Target the Multiple Words Game component
      content: "Play the Multiple Words Game to drag and connect words.",
    },
    {
      target: ".timed-challenges-game", // Target the Timed Challenges component
      content:
        "Challenge yourself with timed exercises to test your knowledge and speed!",
    },
  ];

  return steps;
};
