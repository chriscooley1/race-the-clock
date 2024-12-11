import React, { useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { useTour } from "../context/TourContext";
import { ExtendedCallBackProps } from "../context/TourContext";
import { useLocation } from "react-router-dom";

interface GuidedTourProps {
  steps: Step[];
  isRunning: boolean;
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  tourName: string;
  onStart?: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isRunning,
  onComplete,
  currentStep,
  onStepChange,
  tourName,
  onStart,
}) => {
  const { completeTour, isGuidedTourEnabled, resetTourState } = useTour();
  const location = useLocation();

  // Filter steps based on element visibility
  const visibleSteps = steps.filter((step) => {
    if (typeof step.target === "string") {
      const element = document.querySelector(step.target);
      if (!element) return false;

      // Check if element is visible
      const style = window.getComputedStyle(element);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    }
    return true;
  });

  // Update current step if it's beyond the available steps
  useEffect(() => {
    if (currentStep >= visibleSteps.length) {
      onStepChange(0);
    }
  }, [visibleSteps.length, currentStep]);

  // Reset tour state when component unmounts or location changes
  useEffect(() => {
    return () => {
      resetTourState();
      onStepChange(0);
      onComplete();
    };
  }, [location.pathname]);

  const scrollToTarget = (selector: string) => {
    const target = document.querySelector(selector);
    if (target instanceof HTMLElement) {
      const viewportHeight = window.innerHeight;
      const targetRect = target.getBoundingClientRect();
      const targetPosition = targetRect.top + window.scrollY;

      // Calculate offset to position element in the middle of viewport
      const offset = viewportHeight / 2;
      const offsetPosition = targetPosition - offset;

      // Smooth scroll with a slight delay to ensure UI updates
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleJoyrideCallback = (data: ExtendedCallBackProps) => {
    const { status, index, action, type } = data;

    // Handle tour start
    if (type === "tour:start" && onStart) {
      onStart();
    }

    // Handle tour completion and closing
    if (
      ["finished", "skipped"].includes(status as string) ||
      type === "tour:end"
    ) {
      completeTour(tourName);
      onComplete();
      resetTourState();
      onStepChange(0);
      return;
    }

    // Handle step transitions
    if (type === "step:after") {
      if (action === "next" && index === visibleSteps.length - 1) {
        completeTour(tourName);
        onComplete();
        resetTourState();
        onStepChange(0);
        return;
      }

      // Handle normal step transitions
      if (action === "next" && index < visibleSteps.length - 1) {
        onStepChange(index + 1);
      } else if (action === "prev" && index > 0) {
        onStepChange(index - 1);
      }
    }
  };

  // Initial scroll for the first step
  useEffect(() => {
    if (
      isRunning &&
      visibleSteps[currentStep] &&
      typeof visibleSteps[currentStep].target === "string"
    ) {
      scrollToTarget(visibleSteps[currentStep].target);
    }
  }, [isRunning, currentStep, visibleSteps]);

  return (
    <Joyride
      steps={visibleSteps}
      run={isRunning && isGuidedTourEnabled && visibleSteps.length > 0}
      continuous
      showSkipButton
      showProgress
      stepIndex={currentStep}
      scrollToFirstStep={false}
      scrollOffset={100}
      disableScrolling
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
        placement: "center",
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;
