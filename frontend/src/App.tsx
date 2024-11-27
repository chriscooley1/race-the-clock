import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { Step } from "react-joyride";
import { VisibilityStates } from "./types/VisibilityStates";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";
import GuidedTour from "./components/GuidedTour";
import { TourProvider } from "./context/TourContext";
import FeedbackForm from "./components/FeedbackForm";
import FontPreloader from "./components/FontPreloader";
import { CompletionProvider } from "./context/CompletionContext";

// Import your tour steps here
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
import { tourStepsMatchingGame } from "./pages/Games/tourStepsMatchingGame";
import { tourStepsMultipleWords } from "./pages/Games/tourStepsMultipleWords";

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
import MatchingGame from "./pages/Games/MatchingGame";
import MultipleWordsGame from "./pages/Games/MultipleWordsGame";
import TimedChallenges from "./pages/Games/TimedChallenges";
import Reports from "./pages/Reports/Reports";
import BadgesAchievements from "./pages/BadgesAchievements/BadgesAchievements";

const App: React.FC = () => {
  console.log("App component rendered");

  const { theme } = useTheme();
  const location = useLocation();
  const [hideSidebar, setHideSidebar] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [currentTourName, setCurrentTourName] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("default");
  const [type, setType] = useState<string>("default");
  const [dotCountType, setDotCountType] = useState<string>("fixed");

  useEffect(() => {
    console.log("App state changed");
    console.log("isTourRunning:", isTourRunning);
    console.log("currentTourStep:", currentTourStep);
    const hiddenRoutes = ["/", "/fullscreen-display", "/math-collection"];
    setHideSidebar(hiddenRoutes.includes(location.pathname));
  }, [
    location.pathname,
    hideSidebar,
    isFullScreen,
    isTourRunning,
    currentTourStep,
  ]);

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

  useEffect(() => {
    if (location.pathname === "/collection-setup") {
      const state = location.state as {
        category?: string;
        type?: string;
        dotCountType?: string;
      };
      if (state) {
        setCategory(state.category || "default");
        setType(state.type || "default");
        setDotCountType(state.dotCountType || "fixed");
      }
    }
  }, [location.pathname, location.state]);

  const getTourSteps = (): Step[] => {
    const visibilityStates: VisibilityStates = {
      isCollectionCardVisible: false,
      isStartCollectionButtonVisible: false,
      isEditCollectionButtonVisible: false,
      isDeleteCollectionButtonVisible: false,
      isCollectionNameVisible: false,
      isCategorySelectVisible: false,
      isStageSelectVisible: false,
      isPublicCheckboxVisible: false,
      isSubmitButtonVisible: false,
      isSearchInputVisible: false,
      isSortSelectVisible: false,
      isCollectionsGridVisible: false,
      isPreviewButtonVisible: false,
      isDotCountTypeVisible: false,
      isMinDotsVisible: false,
      isMaxDotsVisible: false,
      isTypeSelectVisible: false,
      isItemCountVisible: false,
      isCollectionItemCountVisible: false,
      isDotColorVisible: false,
      isDotShapeVisible: false,
      isGenerateRandomSequenceButtonVisible: false,
      isFileUploadVisible: false,
      isClearButtonVisible: false,
      isGeneratedSequencePreviewVisible: false,
      isSaveButtonVisible: false,
      isItemPreviewVisible: false,
      isMathProblemVisible: false,
      isDotButtonVisible: false,
      isImageUploadVisible: false,
      isNameInputVisible: false,
      isAddNameButtonVisible: false,
      isSpinButtonVisible: false,
      isNamesListVisible: false,
      isSessionSettingsModalVisible: false,
      isEditCollectionModalVisible: false,
      isDuplicateCollectionModalVisible: false,
      isCollectionPreviewModalVisible: false,
      isNextButtonVisible: false,
    };

    switch (location.pathname) {
      case "/your-collections":
        visibilityStates.isCollectionCardVisible = true;
        visibilityStates.isStartCollectionButtonVisible = true;
        visibilityStates.isEditCollectionButtonVisible = true;
        visibilityStates.isDeleteCollectionButtonVisible = true;
        visibilityStates.isSessionSettingsModalVisible = false;
        visibilityStates.isEditCollectionModalVisible = false;
        visibilityStates.isDuplicateCollectionModalVisible = false;
        visibilityStates.isCollectionPreviewModalVisible = false;
        return tourStepsYourCollections(visibilityStates);
      case "/new-collection":
        visibilityStates.isCollectionNameVisible = true;
        visibilityStates.isCategorySelectVisible = true;
        visibilityStates.isStageSelectVisible = true;
        visibilityStates.isPublicCheckboxVisible = true;
        visibilityStates.isSubmitButtonVisible = true;
        return tourStepsNewCollection(visibilityStates);
      case "/discover-collections":
        visibilityStates.isSearchInputVisible = true;
        visibilityStates.isSortSelectVisible = true;
        visibilityStates.isCollectionsGridVisible = true;
        visibilityStates.isPreviewButtonVisible = true;
        return tourStepsDiscoverCollections(visibilityStates);
      case "/full-screen-display":
        return tourStepsFullScreenDisplay();
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
        return tourStepsCollectionSetup(
          visibilityStates,
          category,
          type,
          dotCountType,
        );
      case "/collection-final-step":
        visibilityStates.isSaveButtonVisible = true;
        visibilityStates.isItemPreviewVisible = true;
        visibilityStates.isMathProblemVisible = true;
        visibilityStates.isDotButtonVisible = true;
        visibilityStates.isImageUploadVisible = true;
        return tourStepsCollectionFinalStep(visibilityStates);
      case "/name-generator":
        visibilityStates.isNameInputVisible = true;
        visibilityStates.isAddNameButtonVisible = true;
        visibilityStates.isSpinButtonVisible = true;
        visibilityStates.isNamesListVisible = true;
        return tourStepsNameGenerator(visibilityStates);
      case "/resources":
        return tourStepsResources();
      case "/settings":
        return tourStepsSettings();
      case "/my-account":
        return tourStepsMyAccount();
      case "/games":
        return tourStepsGames();
      case "/games/matching-game":
        return tourStepsMatchingGame();
      case "/games/multiple-words-game":
        return tourStepsMultipleWords();
      case "/games/timed-challenges":
        return tourStepsTimedChallenges();
      case "/reports":
        return tourStepsReports();
      case "/badges-achievements":
        return tourStepsBadgesAchievements();
      default:
        return [];
    }
  };

  useEffect(() => {
    document.fonts.ready.then(() => {
      console.log("All fonts loaded");
      document.fonts.forEach((font) => {
        console.log(`Font loaded: ${font.family}`);
      });
    });
  }, []);

  return (
    <Auth0ProviderWithHistory>
      <ErrorBoundary>
        <CompletionProvider>
          <TourProvider>
            <FontPreloader />
            <div
              className={`min-h-screen ${theme.className} ${isFullScreen ? "fullscreen" : ""} ${theme.isDarkMode ? "dark" : ""}`}
            >
              <Navbar
                onStartTour={handleTourStart}
                setTourName={setCurrentTourName}
                setCurrentTourStep={setCurrentTourStep}
                setShowFeedback={setShowFeedback}
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
                                setShowFeedback={setShowFeedback}
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
              {showFeedback && (
                <FeedbackForm onClose={() => setShowFeedback(false)} />
              )}
            </div>
          </TourProvider>
        </CompletionProvider>
      </ErrorBoundary>
    </Auth0ProviderWithHistory>
  );
};

export default App;
