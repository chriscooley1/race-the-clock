import React, { useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { useTour } from "../context/TourContext";
import { ExtendedCallBackProps } from "../context/TourContext";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  tourName: string;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
  currentStep,
  onStepChange,
  tourName,
}) => {
  const { completeTour, isGuidedTourEnabled } = useTour();

  const scrollToTarget = (selector: string) => {
    const target = document.querySelector(selector);
    if (target instanceof HTMLElement) {
      const viewportHeight = window.innerHeight;
      const targetRect = target.getBoundingClientRect();
      const targetPosition = targetRect.top + window.scrollY;
      
      // Calculate offset to position element in the middle of viewport
      const offset = viewportHeight / 3;
      const offsetPosition = targetPosition - offset;

      // Smooth scroll with a slight delay to ensure UI updates
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 100);
    }
  };

  const handleJoyrideCallback = (data: ExtendedCallBackProps) => {
    const { status, index, action, type } = data;

    // Handle tour completion
    if (["finished", "skipped"].includes(status as string)) {
      completeTour(tourName);
      onComplete();
      return;
    }

    // Handle step transitions
    if (type === "step:after") {
      // Add check for last step completion
      if (action === "next" && index === steps.length - 1) {
        completeTour(tourName);
        onComplete();
        return;
      }

      if (action === "next" && index < steps.length - 1) {
        onStepChange(index + 1);
        // Pre-emptively scroll to the next target
        const nextStep = steps[index + 1];
        if (nextStep && typeof nextStep.target === "string") {
          scrollToTarget(nextStep.target);
        }
      } else if (action === "prev" && index > 0) {
        onStepChange(index - 1);
        // Scroll to the previous target
        const prevStep = steps[index - 1];
        if (prevStep && typeof prevStep.target === "string") {
          scrollToTarget(prevStep.target);
        }
      }
    }
  };

  // Initial scroll for the first step
  useEffect(() => {
    if (isRunning && steps[currentStep] && typeof steps[currentStep].target === "string") {
      scrollToTarget(steps[currentStep].target);
    }
  }, [isRunning, currentStep, steps]);

  return (
    <Joyride
      steps={steps}
      run={isRunning && isGuidedTourEnabled}
      continuous
      showSkipButton
      showProgress
      stepIndex={currentStep}
      scrollToFirstStep={false} // Disable default scroll behavior
      scrollOffset={100}
      disableScrolling // Disable default scroll behavior
      styles={{
        options: {
          primaryColor: "#007bff",
          zIndex: 10000,
        },
        tooltip: {
          fontSize: "14px",
        },
        buttonNext: {
          backgroundColor: "#007bff",
        },
        buttonBack: {
          color: "#007bff",
        },
      }}
      floaterProps={{
        disableAnimation: true,
        placement: "center", // This helps with positioning
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;
