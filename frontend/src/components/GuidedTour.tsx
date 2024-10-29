import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { useTour } from "../context/TourContext";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  isScrollToEnabled?: boolean;
  tourName: string; // Add tourName prop
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
  currentStep,
  onStepChange,
  isScrollToEnabled,
  tourName,
}) => {
  const { completeTour, setIsTourRunning } = useTour(); // Destructure setIsTourRunning

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (["finished", "skipped"].includes(status as string)) {
      completeTour(tourName); // Pass tourName when calling completeTour
      setIsTourRunning(false); // Set tour running state to false
      onComplete(); // Call onComplete as well
    } else if (data.type === "step:after") {
      if (currentStep + 1 < steps.length) {
        onStepChange(currentStep + 1); // Move to the next step
      } else {
        onComplete(); // Ensure onComplete is called when there are no more steps
      }
      // Scroll to the target element if isScrollToEnabled is true
      if (isScrollToEnabled) {
        const targetSelector = steps[currentStep].target as string;
        const target = document.querySelector(targetSelector);
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
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
