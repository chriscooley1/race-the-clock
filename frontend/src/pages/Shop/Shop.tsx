import React, { useEffect, useState } from "react";
import { tourStepsShop } from "./tourStepsShop";
import GuidedTour from "../../components/GuidedTour";
import { useTheme } from "../../context/ThemeContext";
import { useAuth0 } from "@auth0/auth0-react";
import BubbleText from "../../components/BubbleText";

const Shop: React.FC = () => {
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const { theme } = useTheme();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

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

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: "/shop" },
      });
      return;
    }
    // TODO: Implement subscription purchase logic
    console.log("Subscription purchase clicked");
  };

  return (
    <div className="page-container">
      <div 
        className={`flex min-h-screen w-full flex-col items-center pt-[20px] ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
        }`}
        style={{ color: theme.originalTextColor }}
      >
        <h1 className="mb-8 text-3xl font-bold">
          <BubbleText>Race The Clock Premium</BubbleText>
        </h1>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-lg border p-8 shadow-lg ${
              theme.isDarkMode ? "border-gray-600 bg-gray-700" : "border-black bg-white"
            }`}>
              <h2 className="mb-6 text-center text-2xl font-bold">Single License</h2>
              
              <div className="mb-8">
                <div className="mb-6 text-center text-4xl font-bold">$29.95</div>
                <p className="mb-4 text-center">One-time purchase for lifetime access</p>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Features Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Unlimited Collection Creation
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Advanced Analytics & Reports
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    All Game Modes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Priority Support
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Custom Themes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    All Future Updates
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleSubscribe}
                className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-blue-600 active:bg-blue-700"
              >
                {isAuthenticated ? "Purchase Single License" : "Sign in to Purchase"}
              </button>
            </div>

            <div className={`rounded-lg border p-8 shadow-lg ${
              theme.isDarkMode ? "border-gray-600 bg-gray-700" : "border-black bg-white"
            }`}>
              <h2 className="mb-6 text-center text-2xl font-bold">Multi License Pack</h2>
              
              <div className="mb-8">
                <div className="mb-6 text-center text-4xl font-bold">$69.95</div>
                <p className="mb-4 text-center">One-time purchase for 5 lifetime licenses</p>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Everything in Single License, Plus:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    5 Separate License Keys
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Bulk Account Management
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    50% Cost Savings
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Team Analytics Dashboard
                  </li>
                  <li className="flex items-center opacity-0">
                    <span className="mr-2">✓</span>
                    Spacer
                  </li>
                  <li className="flex items-center opacity-0">
                    <span className="mr-2">✓</span>
                    Spacer
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleSubscribe}
                className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-blue-600 active:bg-blue-700"
              >
                {isAuthenticated ? "Purchase Multi License Pack" : "Sign in to Purchase"}
              </button>
            </div>
          </div>

          <div className={`mt-6 text-center text-sm ${theme.isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p>Questions about Premium? Contact our support team</p>
          </div>
        </div>

        <GuidedTour
          steps={tourStepsShop()}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={handleTourStepChange}
          tourName="shop"
        />
      </div>
    </div>
  );
};

export default Shop;
