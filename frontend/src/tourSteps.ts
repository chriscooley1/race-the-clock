import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".your-collections-link",
    content: "View and manage your collections here.",
    disableBeacon: true,
  },
  {
    target: ".new-collection-link",
    content: "Create a new collection by clicking here.",
  },
  {
    target: ".discover-collections-link",
    content: "Explore collections shared by other users.",
  },
  {
    target: ".name-generator-link",
    content: "Generate unique names for your collections or items.",
  },
  {
    target: ".games-link",
    content: "Access fun and educational games related to your collections.",
  },
  {
    target: ".timed-challenges-link",
    content:
      "Test your skills with timed challenges based on your collections.",
  },
  {
    target: ".reports-link",
    content:
      "View detailed reports and analytics about your progress and usage.",
  },
  {
    target: ".badges-achievements-link",
    content: "Check out the badges and achievements you've earned.",
  },
  {
    target: ".resources-link",
    content: "Find helpful resources and additional information here.",
  },
  // Add more steps as needed

  // YourCollections page
  {
    target: ".your-collections-page",
    content: "This is where you can view and manage all your collections.",
    disableBeacon: true,
  },
  {
    target: ".collection-card",
    content: "Each card represents one of your collections. You can start, edit, or delete a collection from here.",
  },
  {
    target: ".start-collection-button",
    content: "Click here to start a session with this collection.",
  },
  {
    target: ".edit-collection-button",
    content: "Use this button to modify the contents of your collection.",
  },
  {
    target: ".delete-collection-button",
    content: "Remove a collection you no longer need.",
  },

  // DiscoverCollections page
  {
    target: ".discover-collections-page",
    content: "Explore collections created by other users here.",
    disableBeacon: true,
  },
  {
    target: ".search-collections-input",
    content: "Search for specific collections by name or creator.",
  },
  {
    target: ".sort-collections-select",
    content: "Change how the collections are sorted using this dropdown.",
  },
  {
    target: ".preview-collection-button",
    content: "Click to see more details about a collection and subscribe to it.",
  },

  // Modals
  {
    target: ".session-settings-modal",
    content: "Customize your session settings before starting a collection.",
  },
  {
    target: ".edit-collection-modal",
    content: "Add, remove, or modify items in your collection here.",
  },
  {
    target: ".collection-preview-modal",
    content: "Preview a collection's contents and subscribe if you're interested.",
  },

  // Add more steps for other pages and components as needed
];
