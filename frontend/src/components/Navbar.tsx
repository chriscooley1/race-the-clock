import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTour } from "../context/TourContext";
import { Step } from "react-joyride";
import newIcon from "../assets/new.png";
import discoverIcon from "../assets/discover.png";
import gamesIcon from "../assets/games.png";
import spinnerIcon from "../assets/spinner.png";
import collectionsIcon from "../assets/collections.png";
import raceTheClockIcon from "../assets/race-the-clock-logo-colorful.png";

import { tourStepsYourCollections } from "../pages/YourCollections/tourStepsYourCollections";
import { tourStepsNewCollection } from "../pages/NewCollection/tourStepsNewCollection";
import { tourStepsDiscoverCollections } from "../pages/DiscoverCollections/tourStepsDiscoverCollections";
import { tourStepsFullScreenDisplay } from "../pages/FullScreenDisplay/tourStepsFullScreenDisplay";
import { tourStepsCollectionSetup } from "../pages/CollectionSetup/tourStepsCollectionSetup";
import { tourStepsCollectionFinalStep } from "../pages/CollectionFinalStep/tourStepsCollectionFinalStep";
import { tourStepsNameGenerator } from "../pages/NameGenerator/tourStepsNameGenerator";
import { tourStepsResources } from "../pages/Resources/tourStepsResources";
import { tourStepsSettings } from "../pages/Settings/tourStepsSettings";
import { tourStepsMyAccount } from "../pages/MyAccount/tourStepsMyAccount";
import { tourStepsGames } from "../pages/Games/tourStepsGames";
import { tourStepsTimedChallenges } from "../pages/Games/tourStepsTimedChallenges";
import { tourStepsReports } from "../pages/Reports/tourStepsReports";
import { tourStepsBadgesAchievements } from "../pages/BadgesAchievements/tourStepsBadgesAchievements";
import { tourStepsMatchingGame } from "../pages/Games/tourStepsMatchingGame";
import { tourStepsMultipleWords } from "../pages/Games/tourStepsMultipleWords";
import { getDefaultVisibilityStates } from "../utils/tourHelpers";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
  onBack?: () => void;
  hasBackButton?: boolean;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
  setShowFeedback: (show: boolean) => void;
  currentTourName: string;
}

const navigationItems = [
  { path: "/your-collections", icon: <img src={collectionsIcon} alt="Collections" className="w-18 h-18 mt-20" />, label: "Collections" },
  { path: "/new-collection", icon: <img src={newIcon} alt="New" className="w-18 h-18" />, label: "New" },
  { path: "/discover-collections", icon: <img src={discoverIcon} alt="Discover" className="w-18 h-18" />, label: "Discover" },
  { path: "/games", icon: <img src={gamesIcon} alt="Games" className="w-18 h-18" />, label: "Games" },
  { path: "/name-generator", icon: <img src={spinnerIcon} alt="Spinner" className="w-18 h-18" />, label: "Spinner" },
];

const Navbar: React.FC<NavbarProps> = ({
  isPaused,
  onPauseResume,
  onBack,
  hasBackButton,
  onStartTour,
  setTourName,
  setCurrentTourStep,
  setShowFeedback,
  currentTourName,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();
  const { isGuidedTourEnabled } = useTour();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => {
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

  const handleStartTour = useCallback(() => {
    const visibilityStates = getDefaultVisibilityStates();

    // Set visibility states based on the current location
    switch (location.pathname) {
      case "/your-collections":
        visibilityStates.isCollectionCardVisible = true;
        visibilityStates.isStartCollectionButtonVisible = true;
        visibilityStates.isEditCollectionButtonVisible = true;
        visibilityStates.isDeleteCollectionButtonVisible = true;
        break;
      case "/new-collection":
        visibilityStates.isCollectionNameVisible = true;
        visibilityStates.isCategorySelectVisible = true;
        visibilityStates.isStageSelectVisible = true;
        visibilityStates.isPublicCheckboxVisible = true;
        visibilityStates.isSubmitButtonVisible = true;
        break;
      case "/discover-collections":
        visibilityStates.isSearchInputVisible = true;
        visibilityStates.isSortSelectVisible = true;
        visibilityStates.isCollectionsGridVisible = true;
        visibilityStates.isPreviewButtonVisible = true;
        break;
      case "/collection-setup":
        visibilityStates.isDotCountTypeVisible = true;
        visibilityStates.isMinDotsVisible = true;
        visibilityStates.isMaxDotsVisible = true;
        visibilityStates.isTypeSelectVisible = true;
        visibilityStates.isItemCountVisible = true;
        visibilityStates.isCollectionItemCountVisible = true;
        visibilityStates.isDotColorVisible = true;
        visibilityStates.isDotShapeVisible = true;
        visibilityStates.isGenerateRandomSequenceButtonVisible = true;
        visibilityStates.isFileUploadVisible = true;
        visibilityStates.isClearButtonVisible = true;
        visibilityStates.isSubmitButtonVisible = true;
        visibilityStates.isGeneratedSequencePreviewVisible = true;
        visibilityStates.isNextButtonVisible = true;
        break;
      case "/collection-final-step":
        visibilityStates.isSaveButtonVisible = true;
        visibilityStates.isItemPreviewVisible = true;
        visibilityStates.isMathProblemVisible = true;
        visibilityStates.isDotButtonVisible = true;
        visibilityStates.isImageUploadVisible = true;
        break;
      case "/name-generator":
        visibilityStates.isNameInputVisible = true;
        visibilityStates.isAddNameButtonVisible = true;
        visibilityStates.isSpinButtonVisible = true;
        visibilityStates.isNamesListVisible = true;
        break;
      // Add cases for other routes as needed
      default:
        break;
    }

    let steps: Step[];
    let tourName: string;

    // Determine the steps based on the current location
    switch (location.pathname) {
      case "/badges-achievements":
        steps = tourStepsBadgesAchievements();
        tourName = "badgesAchievements";
        break;
      case "/collection-final-step":
        steps = tourStepsCollectionFinalStep(visibilityStates);
        tourName = "collectionFinalStep";
        break;
      case "/collection-setup":
        steps = tourStepsCollectionSetup(
          visibilityStates,
          "default",
          "default",
          "fixed",
        );
        tourName = "collectionSetup";
        break;
      case "/discover-collections":
        steps = tourStepsDiscoverCollections(visibilityStates);
        tourName = "discoverCollections";
        break;
      case "/fullscreen-display":
        steps = tourStepsFullScreenDisplay();
        tourName = "fullscreenDisplay";
        break;
      case "/games":
        steps = tourStepsGames();
        tourName = "games";
        break;
      case "/my-account":
        steps = tourStepsMyAccount();
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
        steps = tourStepsReports();
        tourName = "reports";
        break;
      case "/resources":
        steps = tourStepsResources();
        tourName = "resources";
        break;
      case "/settings":
        steps = tourStepsSettings();
        tourName = "settings";
        break;
      case "/timed-challenges":
        steps = tourStepsTimedChallenges();
        tourName = "timedChallenges";
        break;
      case "/your-collections":
        steps = tourStepsYourCollections(visibilityStates);
        tourName = "yourCollections";
        break;
      case "/games/matching-game":
        steps = tourStepsMatchingGame();
        tourName = "matchingGame";
        break;
      case "/games/multiple-words-game":
        steps = tourStepsMultipleWords();
        tourName = "multipleWords";
        break;
      default:
        steps = [];
        tourName = "navbar";
        console.log(steps);
        break;
    }

    onStartTour();
    setTourName(tourName);
    setCurrentTourStep(0);
  }, [location.pathname, onStartTour, setTourName, setCurrentTourStep]);

  return (
    <div
      className="bg-black inset-x-0 top-0 z-50 flex items-center justify-between px-2 shadow-md md:px-5 dark:bg-gray-800"
      style={{ height: "200px" }}
    >
      <div className="flex flex-col space-y-2">
        {location.pathname === "/fullscreen-display" ? (
          <>
            {/* Top row for Back and Pause/Resume */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="bg-custom-red hover:bg-custom-red-dark rounded border border-black px-3 py-1.5 text-sm font-bold text-white transition-colors duration-300"
                onClick={onBack || handleBack}
              >
                Back
              </button>
              {onPauseResume && (
                <button
                  type="button"
                  className="bg-custom-green hover:bg-custom-green-dark rounded border border-black px-3 py-1.5 text-sm font-bold text-white transition-colors duration-300"
                  onClick={onPauseResume}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
            </div>
            {/* Bottom row for Tour and Feedback - with smaller text and padding */}
            <div className="flex items-center space-x-2">
              {isGuidedTourEnabled && (
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="rounded border border-black bg-blue-500 px-2 py-1 text-xs font-medium text-white transition-colors duration-300 hover:bg-blue-600"
                >
                  Start {currentTourName} Tour
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFeedback(true)}
                className="hover:bg-light-blue-600 rounded border border-black bg-blue-500 px-2 py-1 text-xs font-medium text-white transition-colors duration-300"
              >
                Give Feedback
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            {hasBackButton && (
              <button
                type="button"
                className="bg-custom-red hover:bg-custom-red-dark rounded border border-black px-3 py-2 text-base font-bold text-white transition-colors duration-300"
                onClick={onBack || handleBack}
              >
                Back
              </button>
            )}
            {isGuidedTourEnabled && (
              <button
                type="button"
                onClick={handleStartTour}
                className="rounded border border-black bg-blue-500 px-3 py-2 text-base font-bold text-white transition-colors duration-300 hover:bg-blue-600"
              >
                Start {currentTourName} Tour
              </button>
              )}
          </div>
        )}
      </div>
      <div className="flex grow items-center justify-center space-x-8">
        <img 
          src={raceTheClockIcon} 
          alt="raceTheClockIcon" 
          className="h-40 cursor-pointer transition-all duration-300" 
          onClick={handleTitleClick} 
        />
        
        <nav className="hidden md:flex space-x-6">
          {navigationItems.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="flex flex-col items-center justify-center px-6 py-2 text-white rounded-lg transition-all duration-300 overflow-visible pointer-events-auto"
              style={{ clipPath: 'inset(0)' }}
            >
              <span className="text-6xl pointer-events-none">
                {typeof item.icon === "string" ? item.icon : item.icon}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div
        ref={hamburgerRef}
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
