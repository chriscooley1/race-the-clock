import React, { useEffect, useState } from "react";
import { tourStepsAbout } from "./tourStepsAbout";
import GuidedTour from "../../components/GuidedTour";

const About: React.FC = () => {
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true");
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  return (
    <div className="page-container">
      <h1 className="mb-8 text-3xl font-bold">About</h1>
      <p>
        Learn more about our platform and how we help educators create engaging learning experiences.
      </p>
      <GuidedTour
        steps={tourStepsAbout()}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="about"
      />
    </div>
  );
};

export default About;
