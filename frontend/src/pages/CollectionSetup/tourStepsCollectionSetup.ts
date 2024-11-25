import { Step } from "react-joyride";
import { VisibilityStates } from "../../types/VisibilityStates";

export const tourStepsCollectionSetup = (
  visibilityStates: VisibilityStates,
  category: string,
  type: string,
  dotCountType?: string
): Step[] => {
  const steps: Step[] = [
    {
      target: ".collection-setup",
      content: "Set up your collection here. Fill in the necessary details.",
      disableBeacon: true,
    }
  ];

  // Add category-specific steps
  if (category === "Number Sense") {
    steps.push({
      target: "#dotCountType",
      content: "Choose whether the dot count should be fixed or random.",
      ...(visibilityStates.isDotCountTypeVisible ? { isOpen: true } : {}),
    });

    // Add dot count type specific steps
    if (dotCountType === "fixed") {
      steps.push({
        target: "#itemCount",
        content: "Specify the number of dots for each item.",
        ...(visibilityStates.isItemCountVisible ? { isOpen: true } : {}),
      });
    } else if (dotCountType === "random") {
      steps.push(
        {
          target: "#minDots",
          content: "Set the minimum number of dots for random generation.",
          ...(visibilityStates.isMinDotsVisible ? { isOpen: true } : {}),
        },
        {
          target: "#maxDots",
          content: "Set the maximum number of dots for random generation.",
          ...(visibilityStates.isMaxDotsVisible ? { isOpen: true } : {}),
        }
      );
    }

    // Add Number Sense specific steps
    steps.push(
      {
        target: "#dot-color",
        content: "Select the color for your dots.",
        ...(visibilityStates.isDotColorVisible ? { isOpen: true } : {}),
      },
      {
        target: "#dot-shape",
        content: "Choose the shape for your dots.",
        ...(visibilityStates.isDotShapeVisible ? { isOpen: true } : {}),
      }
    );
  } else {
    // Non-Number Sense steps
    if (!["numbersOneToHundred", "alphabet", "fullPeriodicTable"].includes(type)) {
      steps.push({
        target: "#itemCount",
        content: "Specify the quantity of items you want to generate.",
        ...(visibilityStates.isItemCountVisible ? { isOpen: true } : {}),
      });
    }
  }

  // Common steps for all categories
  steps.push(
    {
      target: "#collectionItemCount",
      content: "Define how many items will be included in the collection.",
      ...(visibilityStates.isCollectionItemCountVisible ? { isOpen: true } : {}),
    },
    {
      target: ".generate-random-sequence-button",
      content: "Click here to generate a random sequence of items.",
      ...(visibilityStates.isGenerateRandomSequenceButtonVisible ? { isOpen: true } : {}),
    }
  );

  // Add preview and action steps if sequence is generated
  if (visibilityStates.isGeneratedSequencePreviewVisible) {
    steps.push({
      target: ".generated-sequence-preview",
      content: "Preview your generated sequence here.",
      ...(visibilityStates.isGeneratedSequencePreviewVisible ? { isOpen: true } : {}),
    });
  }

  // Add final action steps
  steps.push(
    {
      target: ".clear-button",
      content: "Click here to clear the current setup and start over.",
      ...(visibilityStates.isClearButtonVisible ? { isOpen: true } : {}),
    },
    {
      target: ".next-button",
      content: "Proceed to save your collection.",
      ...(visibilityStates.isNextButtonVisible ? { isOpen: true } : {}),
    }
  );

  // Filter out steps based on visibility states
  return steps.filter((step) => {
    const target = step.target as string;
    const visibilityMap: Record<string, boolean> = {
      "#dotCountType": visibilityStates.isDotCountTypeVisible,
      "#minDots": visibilityStates.isMinDotsVisible,
      "#maxDots": visibilityStates.isMaxDotsVisible,
      "#itemCount": visibilityStates.isItemCountVisible,
      "#collectionItemCount": visibilityStates.isCollectionItemCountVisible,
      "#dot-color": visibilityStates.isDotColorVisible,
      "#dot-shape": visibilityStates.isDotShapeVisible,
      ".generate-random-sequence-button": visibilityStates.isGenerateRandomSequenceButtonVisible,
      ".generated-sequence-preview": visibilityStates.isGeneratedSequencePreviewVisible,
      ".clear-button": visibilityStates.isClearButtonVisible,
      ".next-button": visibilityStates.isNextButtonVisible
    };

    return target in visibilityMap ? visibilityMap[target] : true;
  });
};
