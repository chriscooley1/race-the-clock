import React from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
}) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      continuous
      showSkipButton
      showProgress
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
