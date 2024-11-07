import React from "react";
import Joyride, { Step } from "react-joyride";
import { useTour } from "../context/TourContext";
import { ExtendedCallBackProps } from "../context/TourContext";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  isScrollToEnabled?: boolean;
  tourName: string;
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
  const { completeTour, setIsTourRunning } = useTour();

  const handleJoyrideCallback = (data: ExtendedCallBackProps) => {
    const { status, index } = data;

    if (["finished", "skipped"].includes(status as string)) {
      completeTour(tourName);
      setIsTourRunning(false);
      onComplete();
    } else if (data.type === "step:after") {
      onStepChange(index + 1);
      if (isScrollToEnabled) {
        const targetSelector = steps[index].target as string;
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
