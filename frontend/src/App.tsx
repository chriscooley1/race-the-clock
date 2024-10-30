import React, { Suspense, useEffect, useState, ReactNode, ElementType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";
import GuidedTour from "./components/GuidedTour";
import { TourProvider } from "./context/TourContext";
import { BeaconRenderProps } from "react-beacon-map";

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
import { tourStepsTimedChallenges } from "./pages/TimedChallenges/tourStepsTimedChallenges";
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

  const getTourSteps = (): { 
    beaconComponent?: ElementType<BeaconRenderProps>; 
    disableCloseOnEsc?: boolean; 
    disableOverlay?: boolean; 
    title?: ReactNode; 
    content: ReactNode; 
    target: string; 
  }[] => {
    switch (location.pathname) {
      case "/":
        return tourStepsLandingPage as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/your-collections":
        return tourStepsYourCollections as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/new-collection":
        return tourStepsNewCollection as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/full-screen-display":
        return tourStepsFullScreenDisplay as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/discover-collections":
        return tourStepsDiscoverCollections as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/collection-setup":
        return tourStepsCollectionSetup as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/collection-final-step":
        return tourStepsCollectionFinalStep as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/name-generator":
        return tourStepsNameGenerator as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/resources":
        return tourStepsResources as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/settings":
        return tourStepsSettings as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/my-account":
        return tourStepsMyAccount as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/games":
        return tourStepsGames as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/timed-challenges":
        return tourStepsTimedChallenges as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/reports":
        return tourStepsReports as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      case "/badges-achievements":
        return tourStepsBadgesAchievements as unknown as { beaconComponent?: ElementType<BeaconRenderProps>; disableCloseOnEsc?: boolean; disableOverlay?: boolean; title?: ReactNode; content: ReactNode; target: string; }[];
      default:
        return [] as { 
          beaconComponent?: ElementType<BeaconRenderProps>; 
          disableCloseOnEsc?: boolean; 
          disableOverlay?: boolean; 
          title?: ReactNode; 
          content: ReactNode; 
          target: string; 
        }[];
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
            />
            <div className="flex pt-[70px]">
              {!hideSidebar && <Sidebar />}
              <div
                className={`grow ${hideSidebar ? "ml-0" : "ml-[250px]"} main-content-area`}
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
