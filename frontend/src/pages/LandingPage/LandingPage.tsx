import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import { VisibilityStates, tourSteps } from "./tourStepsLandingPage"; // Import the visibility states and tour steps
import GuidedTour from "../../components/GuidedTour"; // Import GuidedTour

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const { theme } = useTheme();

  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isRegisterButtonVisible: true,
    isLoginButtonVisible: true,
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps = tourSteps(visibilityStates); // Create tour steps based on visibility states

  // Add a function to start the tour
  const startTour = () => {
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step
  };

  useEffect(() => {
    // Start the tour when the component mounts
    startTour(); // Call the startTour function
  }, []);

  // Example of using setVisibilityStates
  useEffect(() => {
    // Here you can set visibility states based on your logic
    const newVisibilityStates: VisibilityStates = {
      isRegisterButtonVisible: true, // or false based on your logic
      isLoginButtonVisible: true, // or false based on your logic
    };
    setVisibilityStates(newVisibilityStates);
  }, []); // This effect runs once when the component mounts

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const handleSignup = () => {
    console.log("Signup button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections", isSignup: true } });
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections" } });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center p-5 text-center ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <h1 className="mb-5 box-border text-xl sm:text-2xl md:text-3xl">
        Welcome to Race The Clock
      </h1>
      <div className="w-full max-w-xs">
        {visibilityStates.isRegisterButtonVisible && (
          <button
            type="button"
            onClick={handleSignup}
            className="register-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue mb-2.5 w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
          >
            Register
          </button>
        )}
        {visibilityStates.isLoginButtonVisible && (
          <button
            type="button"
            onClick={handleLogin}
            className="already-registered-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
          >
            Already Registered
          </button>
        )}
      </div>

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
      />
    </div>
  );
};

export default LandingPage;
