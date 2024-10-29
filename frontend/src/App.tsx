import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";
import GuidedTour from "./components/GuidedTour";
import { TourProvider } from "./context/TourContext";

// Import your tour steps here
import { tourSteps as landingPageSteps } from "./pages/LandingPage/tourStepsLandingPage";
import { tourSteps as yourCollectionsSteps } from "./pages/YourCollections/tourStepsYourCollections";
import { tourSteps as newCollectionSteps } from "./pages/NewCollection/tourStepsNewCollection";
import { tourStepsDiscoverCollections } from "./pages/DiscoverCollections/tourStepsDiscoverCollections";
import { tourSteps as fullScreenDisplaySteps } from "./pages/FullScreenDisplay/tourStepsFullScreenDisplay";
import { tourSteps as collectionSetupSteps } from "./pages/CollectionSetup/tourStepsCollectionSetup";
import { tourStepsCollectionFinalStep } from "./pages/CollectionFinalStep/tourStepsCollectionFinalStep";
import { tourSteps as nameGeneratorSteps } from "./pages/NameGenerator/tourStepsNameGenerator";
import { tourSteps as resourcesSteps } from "./pages/Resources/tourStepsResources";
import { tourSteps as settingsSteps } from "./pages/Settings/tourStepsSettings";
import { tourSteps as myAccountSteps } from "./pages/MyAccount/tourStepsMyAccount";
import { tourSteps as gamesSteps } from "./pages/Games/tourStepsGames";
import { tourSteps as timedChallengesSteps } from "./pages/TimedChallenges/tourStepsTimedChallenges";
import { tourSteps as reportsSteps } from "./pages/Reports/tourStepsReports";
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
import TimedChallenges from "./pages/TimedChallenges/TimedChallenges";
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

  const getTourSteps = () => {
    switch (location.pathname) {
      case "/":
        return landingPageSteps;
      case "/your-collections":
        return yourCollectionsSteps;
      case "/new-collection":
        return newCollectionSteps;
      case "/full-screen-display":
        return fullScreenDisplaySteps;
      case "/discover-collections":
        return tourStepsDiscoverCollections;
      case "/collection-setup":
        return collectionSetupSteps;
      case "/collection-final-step":
        return tourStepsCollectionFinalStep;
      case "/name-generator":
        return nameGeneratorSteps;
      case "/resources":
        return resourcesSteps;
      case "/settings":
        return settingsSteps;
      case "/my-account":
        return myAccountSteps;
      case "/games":
        return gamesSteps;
      case "/timed-challenges":
        return timedChallengesSteps;
      case "/reports":
        return reportsSteps;
      case "/badges-achievements":
        return tourStepsBadgesAchievements;
      default:
        return [];
    }
  };

  return (
    <Auth0ProviderWithHistory>
      <ErrorBoundary>
        <TourProvider>
          <div className={`min-h-screen ${theme.className} ${isFullScreen ? "fullscreen" : ""} ${theme.isDarkMode ? "dark" : ""}`}>
            <Navbar onStartTour={handleTourStart} setTourName={setCurrentTourName} />
            <div className="flex pt-[70px]">
              {!hideSidebar && <Sidebar />}
              <div className={`grow ${hideSidebar ? "ml-0" : "ml-[250px]"} main-content-area`}>
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
                    path="/timed-challenges"
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
          </div>
        </TourProvider>
      </ErrorBoundary>
    </Auth0ProviderWithHistory>
  );
};

export default App;
