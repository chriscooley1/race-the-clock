import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import { useTour } from "../../context/TourContext";
import { VisibilityStates } from "../../types/VisibilityStates";
import { Step } from "react-joyride";

import { tourStepsLandingPage } from "../../pages/LandingPage/tourStepsLandingPage";
import { tourStepsYourCollections } from "../../pages/YourCollections/tourStepsYourCollections";
import { tourStepsNewCollection } from "../../pages/NewCollection/tourStepsNewCollection";
import { tourStepsDiscoverCollections } from "../../pages/DiscoverCollections/tourStepsDiscoverCollections";
import { tourStepsFullScreenDisplay } from "../../pages/FullScreenDisplay/tourStepsFullScreenDisplay";
import { tourStepsCollectionSetup } from "../../pages/CollectionSetup/tourStepsCollectionSetup";
import { tourStepsCollectionFinalStep } from "../../pages/CollectionFinalStep/tourStepsCollectionFinalStep";
import { tourStepsNameGenerator } from "../../pages/NameGenerator/tourStepsNameGenerator";
import { tourStepsResources } from "../../pages/Resources/tourStepsResources";
import { tourStepsSettings } from "../../pages/Settings/tourStepsSettings";
import { tourStepsMyAccount } from "../../pages/MyAccount/tourStepsMyAccount";
import { tourStepsGames } from "../../pages/Games/tourStepsGames";
import { tourStepsTimedChallenges } from "../../pages/TimedChallenges/tourStepsTimedChallenges";
import { tourStepsReports } from "../../pages/Reports/tourStepsReports";
import { tourStepsBadgesAchievements } from "../../pages/BadgesAchievements/tourStepsBadgesAchievements";
import { tourStepsNavbar } from "./tourStepsNavbar";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
  onBack?: () => void;
  hasBackButton?: boolean;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
}

const Navbar: React.FC<NavbarProps> = ({
  isPaused,
  onPauseResume,
  onBack,
  hasBackButton,
  onStartTour,
  setTourName,
  setCurrentTourStep,
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
      isTypeSelectVisible: true,
      isItemCountVisible: true,
      isCollectionItemCountVisible: true,
      isDotColorVisible: true,
      isDotShapeVisible: true,
      isGenerateRandomSequenceButtonVisible: true,
      isFileUploadVisible: true,
      isNextButtonVisible: true,
      isClearButtonVisible: true,
      isGeneratedSequencePreviewVisible: true,
      isNameInputVisible: false,
      isAddNameButtonVisible: false,
      isSpinButtonVisible: false,
      isNamesListVisible: false,
      isCollectionNameVisible: false,
      isCategorySelectVisible: false,
      isStageSelectVisible: false,
      isPublicCheckboxVisible: false,
      isSubmitButtonVisible: false,
      isReportsOverviewVisible: false,
      isReportsListVisible: false,
      isFAQSectionVisible: false,
      isInstructionalVideosVisible: false,
      isTimedChallengesVisible: false,
      isCollectionsOverviewVisible: false,
      isCollectionCardVisible: false,
      isStartCollectionButtonVisible: false,
      isEditCollectionButtonVisible: false,
      isDeleteCollectionButtonVisible: false,
      isMainFontVisible: false,
      isHeadingFontVisible: false,
      isButtonFontVisible: false,
      isColorThemeVisible: false,
      isTextColorVisible: false,
      isBackgroundColorVisible: false,
      isAccessibilityVisible: false,
      isBackgroundThemeVisible: false,
    };

    let steps: Step[];
    let tourName: string;

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
        steps = tourStepsFullScreenDisplay(visibilityStates);
        tourName = "fullscreenDisplay";
        break;
      case "/games":
        steps = tourStepsGames(visibilityStates);
        tourName = "games";
        break;
      case "/landing-page":
        steps = tourStepsLandingPage(visibilityStates);
        tourName = "landingPage";
        break;
      case "/my-account":
        steps = tourStepsMyAccount(visibilityStates);
        tourName = "myAccount";
        break;
      case "/name-generator":
        steps = tourStepsNameGenerator(visibilityStates);
        tourName = "nameGenerator";
        break;
      case "/new-collection":
        steps = tourStepsNewCollection(visibilityStates);
        tourName = "newCollection";
        break;
      case "/reports":
        steps = tourStepsReports(visibilityStates);
        tourName = "reports";
        break;
      case "/resources":
        steps = tourStepsResources(visibilityStates);
        tourName = "resources";
        break;
      case "/settings":
        steps = tourStepsSettings(visibilityStates);
        tourName = "settings";
        break;
      case "/timed-challenges":
        steps = tourStepsTimedChallenges(visibilityStates);
        tourName = "timedChallenges";
        break;
      case "/your-collections":
        steps = tourStepsYourCollections(visibilityStates);
        tourName = "yourCollections";
        break;
      default:
        steps = tourStepsNavbar;
        tourName = "navbar";
        break;
    }

    onStartTour?.();
    startTour(steps);
    setTourName(tourName);
    setCurrentTourStep(0);
  }, [location.pathname, startTour, onStartTour, setTourName, setCurrentTourStep]);

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
        {location.pathname === "/fullscreen-display" && onPauseResume && (
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
