import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { useTour } from "../context/TourContext"; // Import the useTour hook

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  isScrollToEnabled?: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
  currentStep,
  onStepChange,
  isScrollToEnabled,
}) => {
  const { completeTour } = useTour(); // Get completeTour from context

  console.log("Steps array before starting tour:", steps);

  const handleJoyrideCallback = (data: CallBackProps) => {
    console.log("Joyride callback data:", data);
    const { status, index, type } = data;

    if (["finished", "skipped"].includes(status as string)) {
      completeTour(); // Call completeTour when the tour is finished or skipped
      onComplete(); // Call onComplete as well
    } else if (type === "step:after") {
      console.log("Current step index:", index);
      if (index + 1 < steps.length) {
        onStepChange(index + 1); // Move to the next step
      } else {
        console.log("No more steps to navigate.");
        onComplete(); // Ensure onComplete is called when there are no more steps
      }
      // Scroll to the target element if isScrollToEnabled is true
      if (isScrollToEnabled) {
        const targetSelector = steps[index].target as string; // Ensure targetSelector is a string
        console.log("Scrolling to target:", targetSelector);
        const target = document.querySelector(targetSelector);
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          console.warn(`Target not found for selector: ${targetSelector}`);
          // Optionally, you can move to the next step if the target is not found
          onStepChange(index + 1);
        }
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      continuous
      showSkipButton
      showProgress
      stepIndex={currentStep}
      styles={{
        options: {
          primaryColor: "#007bff",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;
