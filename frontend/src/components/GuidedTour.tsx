import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
  currentStep,
  onStepChange,
}) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    console.log("Joyride callback data:", data); // Log the callback data
    const { status, index, type } = data;
    if (["finished", "skipped"].includes(status as string)) {
      onComplete();
    } else if (type === "step:after") {
      onStepChange(index + 1);
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
