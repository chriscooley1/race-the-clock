import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { VisibilityStates, tourSteps } from "./tourStepsGames"; // Import visibility states and tour steps
import GuidedTour from "../../components/GuidedTour"; // Import GuidedTour

const Games: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isMatchingGameVisible: true,
    isMultipleWordsGameVisible: true,
  });

  useEffect(() => {
    // Simulate loading data or setup
    const loadData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Example of updating visibility states based on some condition
  useEffect(() => {
    // You can set visibility states based on your logic here
    setVisibilityStates({
      isMatchingGameVisible: true, // or false based on your logic
      isMultipleWordsGameVisible: true, // or false based on your logic
    });
  }, []); // This effect runs once when the component mounts

  // Start the tour when the component mounts
  useEffect(() => {
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } games`}
    >
      <h1 className="mb-8 text-3xl font-bold">Games</h1>
      <p>
        Welcome to the Games page! Here are some fun activities to enhance
        engagement.
      </p>

      {isLoading ? (
        <p>Loading games...</p>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="matching-game mt-8">
            <h2 className="text-2xl font-semibold">Matching Game</h2>
            <p>Match the letters with the corresponding images!</p>
            {/* Add your game logic and UI here */}
          </div>

          <div className="multiple-words-game mt-8">
            <h2 className="text-2xl font-semibold">Multiple Words Game</h2>
            <p>Drag and connect words to their corresponding cards!</p>
            {/* Add your game logic and UI here */}
          </div>
        </div>
      )}

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={tourSteps(visibilityStates)} // Pass the visibility states to create tour steps
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
      />
    </div>
  );
};

export default Games;
