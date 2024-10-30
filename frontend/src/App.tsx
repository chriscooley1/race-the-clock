import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { Step } from "react-joyride";
import { VisibilityStates } from "./types/VisibilityStates";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";
import GuidedTour from "./components/GuidedTour";
import { TourProvider } from "./context/TourContext";
import MatchingGame from "./pages/Games/MatchingGame";
import MultipleWordsGame from "./pages/Games/MultipleWordsGame";
import TimedChallenges from "./pages/Games/TimedChallenges";

// Import your tour steps here
import { tourStepsLandingPage } from "./pages/LandingPage/tourStepsLandingPage";
import { tourStepsYourCollections } from "./pages/YourCollections/tourStepsYourCollections";
import { tourStepsNewCollection } from "./pages/NewCollection/tourStepsNewCollection";
import { tourStepsDiscoverCollections } from "./pages/DiscoverCollections/tourStepsDiscoverCollections";
import { tourStepsFullScreenDisplay } from "./pages/FullScreenDisplay/tourStepsFullScreenDisplay";
import { tourStepsCollectionSetup } from "./pages/CollectionSetup/tourStepsCollectionSetup";
import { tourStepsCollectionFinalStep } from "./pages/CollectionFinalStep/tourStepsCollectionFinalStep";
import { tourStepsNameGenerator } from "./pages/NameGenerator/tourStepsNameGenerator";
import { tourStepsResources } from "./pages/Resources/tourStepsResources";
import { tourStepsSettings } from "./pages/Settings/tourStepsSettings";
import { tourStepsMyAccount } from "./pages/MyAccount/tourStepsMyAccount";
import { tourStepsGames } from "./pages/Games/tourStepsGames";
import { tourStepsTimedChallenges } from "./pages/Games/tourStepsTimedChallenges";
import { tourStepsReports } from "./pages/Reports/tourStepsReports";
import { tourStepsBadgesAchievements } from "./pages/BadgesAchievements/tourStepsBadgesAchievements";

// Import your page components here
import LandingPage from "./pages/LandingPage/LandingPage";
import FullScreenDisplay from "./pages/FullScreenDisplay/FullScreenDisplay";
import YourCollections from "./pages/YourCollections/YourCollections";
import NewCollection from "./pages/NewCollection/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator/NameGenerator";
import Resources from "./pages/Resources/Resources";
import Settings from "./pages/Settings/Settings";
import MyAccount from "./pages/MyAccount/MyAccount";
import Games from "./pages/Games/Games";
import Reports from "./pages/Reports/Reports";
import BadgesAchievements from "./pages/BadgesAchievements/BadgesAchievements";

const App: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [hideSidebar, setHideSidebar] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [currentTourName, setCurrentTourName] = useState<string>("");

  useEffect(() => {
    const hiddenRoutes = ["/", "/fullscreen-display", "/math-collection"];
    setHideSidebar(hiddenRoutes.includes(location.pathname));
  }, [location.pathname]);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true");
  };

  const handleTourStart = () => {
    setIsTourRunning(true);
    setCurrentTourStep(0);
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const getTourSteps = (): Step[] => {
    const visibilityStates: VisibilityStates = {
      isDotCountTypeVisible: true,
      isMinDotsVisible: true,
      isMaxDotsVisible: false,
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
      isBadgesSectionVisible: false,
      isAchievementsSectionVisible: false,
      isLoadingMessageVisible: false,
      isSearchInputVisible: false,
      isSortSelectVisible: false,
      isCollectionsGridVisible: false,
      isPreviewButtonVisible: false,
      isSaveButtonVisible: false,
      isItemPreviewVisible: false,
      isMathProblemVisible: false,
      isDotButtonVisible: false,
      isImageUploadVisible: false,
      isPreviousButtonVisible: false,
      isProgressIndicatorVisible: false,
      isPauseButtonVisible: false,
      isScreenClickAreaVisible: false,
      isMatchingGameVisible: false,
      isMultipleWordsGameVisible: false,
      isRegisterButtonVisible: true,
      isLoginButtonVisible: true,
      isProfileVisible: false,
      isUpdateFormVisible: false,
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

    switch (location.pathname) {
      case "/":
        return tourStepsLandingPage(visibilityStates);
      case "/your-collections":
        return tourStepsYourCollections(visibilityStates);
      case "/new-collection":
        return tourStepsNewCollection(visibilityStates);
      case "/discover-collections":
        return tourStepsDiscoverCollections(visibilityStates);
      case "/full-screen-display":
        return tourStepsFullScreenDisplay(visibilityStates);
      case "/collection-setup":
        return tourStepsCollectionSetup(visibilityStates);
      case "/collection-final-step":
        return tourStepsCollectionFinalStep(visibilityStates);
      case "/name-generator":
        return tourStepsNameGenerator(visibilityStates);
      case "/resources":
        return tourStepsResources(visibilityStates);
      case "/settings":
        return tourStepsSettings(visibilityStates);
      case "/my-account":
        return tourStepsMyAccount(visibilityStates);
      case "/games":
        return tourStepsGames(visibilityStates);
      case "/timed-challenges":
        return tourStepsTimedChallenges(visibilityStates);
      case "/reports":
        return tourStepsReports(visibilityStates);
      case "/badges-achievements":
        return tourStepsBadgesAchievements(visibilityStates);
      default:
        return [];
    }
  };

  return (
    <Auth0ProviderWithHistory>
      <ErrorBoundary>
        <TourProvider>
          <div
            className={`min-h-screen ${theme.className} ${isFullScreen ? "fullscreen" : ""} ${theme.isDarkMode ? "dark" : ""}`}
          >
            <Navbar
              onStartTour={handleTourStart}
              setTourName={setCurrentTourName}
              setCurrentTourStep={setCurrentTourStep}
            />
            <div className="flex pt-[70px]">
              {!hideSidebar && <Sidebar />}
              <div
                className={`grow ${hideSidebar ? "ml-0" : "ml-[250px]"} main-content-area flex flex-col items-center`}
              >
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/fullscreen-display"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute
                          element={
                            <FullScreenDisplay
                              onEnterFullScreen={() => setIsFullScreen(true)}
                              onExitFullScreen={() => setIsFullScreen(false)}
                            />
                          }
                        />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/your-collections"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<YourCollections />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/new-collection"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<NewCollection />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/discover-collections"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<DiscoverCollections />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/collection-setup"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<CollectionSetup />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/collection-final-step"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<CollectionFinalStep />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/name-generator"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<NameGenerator />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<Resources />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<Settings />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/my-account"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<MyAccount />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/games"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<Games />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/games/timed-challenges"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<TimedChallenges />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<Reports />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/badges-achievements"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<BadgesAchievements />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/games/matching-game"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<MatchingGame />} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/games/multiple-words-game"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute element={<MultipleWordsGame />} />
                      </Suspense>
                    }
                  />
                </Routes>
              </div>
            </div>
            <GuidedTour
              steps={getTourSteps()}
              isRunning={isTourRunning}
              onComplete={handleTourComplete}
              currentStep={currentTourStep}
              onStepChange={handleTourStepChange}
              tourName={currentTourName}
            />
          </div>
        </TourProvider>
      </ErrorBoundary>
    </Auth0ProviderWithHistory>
  );
};

export default App;
