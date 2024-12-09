import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { tourStepsShop } from "../pages/Shop/tourStepsShop";
import { tourStepsAbout } from "../pages/Home/tourStepsAbout";
import { getDefaultVisibilityStates } from "../utils/tourHelpers";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
  onBack?: () => void;
  hasBackButton?: boolean;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
}

const navigationItems = [
  {
    path: "/your-collections",
    icon: <img src={collectionsIcon} alt="Collections" className="size-40" />,
  },
  {
    path: "/new-collection",
    icon: <img src={newIcon} alt="New" className="size-40" />,
  },
  {
    path: "/discover-collections",
    icon: <img src={discoverIcon} alt="Discover" className="size-40" />,
  },
  {
    path: "/games",
    icon: <img src={gamesIcon} alt="Games" className="size-40" />,
  },
  {
    path: "/name-generator",
    icon: <img src={spinnerIcon} alt="Spinner" className="size-40" />,
  },
];

const Navbar: React.FC<NavbarProps> = ({
  isPaused,
  onPauseResume,
  onBack,
  hasBackButton,
  onStartTour,
  setTourName,
  setCurrentTourStep,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleBack = () => {
    navigate("/your-collections");
  };

  const handleTitleClick = () => {
    navigate("/your-collections");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      case "/shop":
        steps = tourStepsShop();
        tourName = "shop";
        break;
      case "/about":
        steps = tourStepsAbout();
        tourName = "about";
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
      className="inset-x-0 top-0 z-50 flex items-center justify-between bg-black px-2 shadow-md md:px-5 dark:bg-gray-800"
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
            {/* Bottom row for Tour */}
            <div className="flex items-center space-x-2">
              {/* No guided tour button in the Navbar */}
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
          </div>
        )}
      </div>
      <div className="flex grow items-center justify-center space-x-8">
        <img
          src={raceTheClockIcon}
          alt="raceTheClockIcon"
          className="h-48 cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={handleTitleClick}
        />

        <nav className="hidden space-x-8 md:flex">
          {navigationItems.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="group flex flex-col items-center justify-center px-4 py-2 text-white transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex items-center justify-center">
                {typeof item.icon === "string" ? item.icon : item.icon}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
