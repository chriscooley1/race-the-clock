import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".discover-collections-page", // Target the main container
    content: "Explore collections created by other users here.",
    disableBeacon: true,
  },
  {
    target: ".search-collections-input", // Target the search input
    content: "Search for specific collections by name or creator.",
  },
  {
    target: "#sortSelect", // Target the sort dropdown
    content: "Change how the collections are sorted using this dropdown.",
  },
  {
    target: ".grid", // Target the collections grid
    content: "Here are the collections available for you to explore.",
  },
  {
    target: ".preview-collection-button", // Target the preview button
    content:
      "Click to see more details about a collection and subscribe to it.",
  },
  // Add more steps as needed
];
