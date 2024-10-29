import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import { useTour } from "../../context/TourContext";
import { tourStepsNavbar } from "./tourStepsNavbar";
import { VisibilityStates } from "../../types/VisibilityStates";
import { Step } from "react-joyride";

import { tourSteps as landingPageSteps } from "../../pages/LandingPage/tourStepsLandingPage";
import { tourSteps as yourCollectionsSteps } from "../../pages/YourCollections/tourStepsYourCollections";
import { tourSteps as newCollectionSteps } from "../../pages/NewCollection/tourStepsNewCollection";
import { tourStepsDiscoverCollections } from "../../pages/DiscoverCollections/tourStepsDiscoverCollections";
import { tourSteps as fullScreenDisplaySteps } from "../../pages/FullScreenDisplay/tourStepsFullScreenDisplay";
import { tourStepsCollectionSetup } from "../../pages/CollectionSetup/tourStepsCollectionSetup";
import { tourStepsCollectionFinalStep } from "../../pages/CollectionFinalStep/tourStepsCollectionFinalStep";
import { tourSteps as nameGeneratorSteps } from "../../pages/NameGenerator/tourStepsNameGenerator";
import { tourSteps as resourcesSteps } from "../../pages/Resources/tourStepsResources";
import { tourSteps as settingsSteps } from "../../pages/Settings/tourStepsSettings";
import { tourSteps as myAccountSteps } from "../../pages/MyAccount/tourStepsMyAccount";
import { tourSteps as gamesSteps } from "../../pages/Games/tourStepsGames";
import { tourSteps as timedChallengesSteps } from "../../pages/TimedChallenges/tourStepsTimedChallenges";
import { tourSteps as reportsSteps } from "../../pages/Reports/tourStepsReports";
import { tourStepsBadgesAchievements } from "../../pages/BadgesAchievements/tourStepsBadgesAchievements";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
  onBack?: () => void;
  hasBackButton?: boolean;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({
  isPaused,
  onPauseResume,
  onBack,
  hasBackButton,
  onStartTour,
  setTourName,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();
  const { theme, toggleDarkMode } = useTheme();
  const { startTour } = useTour();

  const handleMenuToggle = () => {
    console.log("Toggling menu. Current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logout({ logoutParams: { returnTo: window.location.origin } });
    setMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
    setMenuOpen(false);
  };

  const handleBack = () => {
    navigate("/your-collections");
  };

  const handleTitleClick = () => {
    navigate("/your-collections");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("Clicked outside menu, closing...");
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("Cleaning up event listener for handleClickOutside");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartTour = useCallback(() => {
    const visibilityStates: VisibilityStates = {
      isDotCountTypeVisible: true,
      isMinDotsVisible: true,
      isMaxDotsVisible: true,
      isTypeSelectVisible: false,
      isItemCountVisible: false,
      isCollectionItemCountVisible: false,
      isDotColorVisible: false,
      isDotShapeVisible: false,
      isGenerateRandomSequenceButtonVisible: false,
      isFileUploadVisible: false,
      isNextButtonVisible: false,
      isClearButtonVisible: false,
      isGeneratedSequencePreviewVisible: false,
      // Set additional properties as needed
    };

    let steps: Step[];
    let tourName: string; // Declare a variable for the tour name

    // Determine the steps based on the current location
    switch (location.pathname) {
      case "/badges-achievements":
        steps = tourStepsBadgesAchievements(visibilityStates);
        tourName = "badgesAchievements";
        break;
      case "/collection-final-step":
        steps = tourStepsCollectionFinalStep(visibilityStates);
        tourName = "collectionFinalStep";
        break;
      case "/collection-setup":
        steps = tourStepsCollectionSetup(visibilityStates);
        tourName = "collectionSetup";
        break;
      case "/discover-collections":
        steps = tourStepsDiscoverCollections(visibilityStates);
        tourName = "discoverCollections";
        break;
      case "/fullscreen-display":
        steps = fullScreenDisplaySteps; // Use it directly if it's an array
        tourName = "fullscreenDisplay";
        break;
      case "/games":
        steps = gamesSteps(visibilityStates);
        tourName = "games";
        break;
      case "/landing-page":
        steps = landingPageSteps(visibilityStates);
        tourName = "landingPage";
        break;
      case "/my-account":
        steps = myAccountSteps(visibilityStates);
        tourName = "myAccount";
        break;
      case "/name-generator":
        steps = nameGeneratorSteps(visibilityStates);
        tourName = "nameGenerator";
        break;
      case "/new-collection":
        steps = newCollectionSteps(visibilityStates);
        tourName = "newCollection";
        break;
      case "/reports":
        steps = reportsSteps(visibilityStates);
        tourName = "reports";
        break;
      case "/resources":
        steps = resourcesSteps(visibilityStates);
        tourName = "resources";
        break;
      case "/settings":
        steps = settingsSteps(visibilityStates);
        tourName = "settings";
        break;
      case "/timed-challenges":
        steps = timedChallengesSteps(visibilityStates);
        tourName = "timedChallenges";
        break;
      case "/your-collections":
        steps = yourCollectionsSteps(visibilityStates);
        tourName = "yourCollections";
        break;
      // Add more cases for other pages as needed
      default:
        steps = tourStepsNavbar; // Default to navbar steps if no specific tour is found
        tourName = "navbar";
        break;
    }

    onStartTour?.(); // Call onStartTour if it's provided
    startTour(steps); // Start the tour with the steps
    // Pass the tourName to the GuidedTour component
    setTourName(tourName); // Assuming you have a way to set the current tour name
  }, [location.pathname, startTour, onStartTour]);

  return (
    <div className="bg-light-blue fixed inset-x-0 top-0 z-50 flex h-[50px] items-center justify-between px-2 shadow-md md:px-5 dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-full bg-gray-200 p-2 text-gray-800 dark:bg-gray-600 dark:text-white"
        >
          {theme.isDarkMode ? "☀️" : "🌙"}
        </button>
        {(location.pathname === "/fullscreen-display" || hasBackButton) && (
          <button
            type="button"
            className="bg-custom-red hover:bg-custom-red-dark rounded px-2 py-1 text-sm font-bold text-white transition-colors duration-300 md:px-4 md:py-2 md:text-base"
            onClick={onBack || handleBack}
          >
            Back
          </button>
        )}
        {onPauseResume && (
          <button
            type="button"
            className="bg-custom-green hover:bg-custom-green-dark rounded px-2 py-1 text-sm font-bold text-white transition-colors duration-300 md:px-4 md:py-2 md:text-base"
            onClick={onPauseResume}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button
          type="button"
          onClick={handleStartTour}
          className="rounded bg-blue-500 px-2 py-1 text-sm font-bold text-white transition-colors duration-300 hover:bg-blue-600 md:px-4 md:py-2 md:text-base"
        >
          Start Tour
        </button>
      </div>
      <div
        className="grow cursor-pointer text-center text-base font-bold text-gray-800 md:text-xl dark:text-white"
        onClick={handleTitleClick}
      >
        Race The Clock
      </div>
      <div
        className="flex h-[25px] w-[30px] cursor-pointer flex-col justify-between"
        onClick={handleMenuToggle}
      >
        <div className="h-[3px] bg-gray-800 dark:bg-white"></div>
        <div className="h-[3px] bg-gray-800 dark:bg-white"></div>
        <div className="h-[3px] bg-gray-800 dark:bg-white"></div>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-[50px] z-[1001] w-full rounded-b bg-white p-2 shadow-md md:w-48 dark:bg-gray-700"
        >
          <button
            type="button"
            className="hover:text-hover-blue w-full px-4 py-3 text-left text-gray-800 transition-colors duration-300 dark:text-white"
            onClick={() => handleNavigate("/my-account")}
          >
            My Account
          </button>
          <button
            type="button"
            className="hover:text-hover-blue w-full px-4 py-3 text-left text-gray-800 transition-colors duration-300 dark:text-white"
            onClick={() => handleNavigate("/settings")}
          >
            Settings
          </button>
          <button
            type="button"
            className="hover:text-hover-blue w-full px-4 py-3 text-left text-gray-800 transition-colors duration-300 dark:text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
