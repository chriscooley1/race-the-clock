import React, { useEffect, useState } from "react";
import { tourStepsShop } from "./tourStepsShop";
import GuidedTour from "../../components/GuidedTour";

const Shop: React.FC = () => {
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
      <h1 className="mb-8 text-3xl font-bold">Shop</h1>
      <p>
        Welcome to our Shop! Here you can browse and purchase various educational materials and resources.
      </p>
      <GuidedTour
        steps={tourStepsShop()}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="shop"
      />
    </div>
  );
};

export default Shop;
