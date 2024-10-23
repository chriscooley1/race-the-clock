import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".your-collections-page", // Target the main container
    content: "This is where you can view and manage all your collections.",
    disableBeacon: true,
  },
  {
    target: ".collection-card", // Target a collection card
    content: "Each card represents one of your collections. You can start, edit, or delete a collection from here.",
  },
  {
    target: ".start-collection-button", // Target the start button
    content: "Click here to start a session with this collection.",
  },
  {
    target: ".edit-collection-button", // Target the edit button
    content: "Use this button to modify the contents of your collection.",
  },
  {
    target: ".delete-collection-button", // Target the delete button
    content: "Remove a collection you no longer need.",
  },
  {
    target: ".duplicate-collection-button", // Target the duplicate button
    content: "Click here to create a duplicate of this collection.",
  },
  // Add more steps as needed
];
