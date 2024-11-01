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
    console.log("Joyride Callback Data:", data);
    const { status, index, type, action } = data;

    // Handle tour completion
    if (["finished", "skipped"].includes(status as string)) {
      completeTour(tourName);
      setIsTourRunning(false);
      onComplete();
      return;
    }

    // Handle step navigation
    if (type === "step:after") {
      if (action === "next") {
        // Move to the next step if available
        if (index + 1 < steps.length) {
          onStepChange(index + 1);
        } else {
          // If we're at the last step, complete the tour
          completeTour(tourName);
          setIsTourRunning(false);
          onComplete();
        }
      } else if (action === "prev") {
        // Move to the previous step if available
        if (index - 1 >= 0) {
          onStepChange(index - 1);
        }
      }

      // Handle scrolling if enabled
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
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      stepIndex={currentStep}
      disableOverlayClose={true}
      disableCloseOnEsc={true}
      hideBackButton={false}
      spotlightClicks={true}
      styles={{
        options: {
          primaryColor: "#007bff",
          zIndex: 1000,
        },
        buttonNext: {
          backgroundColor: "#007bff",
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
      locale={{
        last: "End tour",
        next: "Next",
        skip: "Skip tour",
        back: "Back",
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;
