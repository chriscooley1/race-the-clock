import React, { useState, useEffect } from "react";
import creditsButton from "../../assets/credits-button.png";
import BubbleText from "../../components/BubbleText";
import { tourStepsCredits } from "./tourStepsCredits";
import GuidedTour from "../../components/GuidedTour";
import { useTheme } from "../../context/ThemeContext";

const Credits: React.FC = () => {
  const { theme } = useTheme();
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" || theme.isDarkMode
      ? "text-white"
      : "text-black";
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem(`tourCompleted_credits`);
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem(`tourCompleted_credits`, "true");
  };

  return (
    <div
      className={`flex flex-col items-center p-8 ${getTextColorClass(theme.backgroundColor)}`}
    >
      <div className="relative w-full max-w-2xl">
        <img
          src={creditsButton}
          alt="Credits Button"
          className="absolute -right-32 top-0 w-32"
        />

        <h1 className="inherit mb-8 text-6xl font-bold">
          <BubbleText>Credits</BubbleText>
        </h1>

        <div className="max-w-2xl">
          <h2 className="inherit mb-4 text-3xl">A special thanks given to:</h2>

          <div className="mb-8">
            <p className="inherit mb-2">
              Bunny on a cloud for the fonts and clipart. Check out the store
              and website here!
            </p>
            <div className="space-y-2">
              <a
                href="https://bunnyonacloud.com/"
                className="block text-blue-600 hover:text-blue-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://bunnyonacloud.com/
              </a>
              <a
                href="https://www.teacherspayteachers.com/store/bunny-on-a-cloud"
                className="block text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.teacherspayteachers.com/store/bunny-on-a-cloud
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="inherit mb-4 text-2xl font-bold">
              Trademark Notice
            </h3>
            <p className="inherit">
              Race The Clock™ and associated branding are trademarks used to
              identify our educational services.
            </p>
          </div>

          <div className="inherit text-lg">
            <p className="inherit">Website created by Chris Cooley</p>
            <p className="inherit">Design created by Carissa Cooley</p>
          </div>
        </div>
      </div>
      <GuidedTour
        steps={tourStepsCredits()}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="credits"
      />
    </div>
  );
};

export default Credits;
