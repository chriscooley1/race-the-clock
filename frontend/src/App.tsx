import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";

// Import your page components here
import LandingPage from "./pages/LandingPage";
import FullScreenDisplay from "./pages/FullScreenDisplay";
import YourCollections from "./pages/YourCollections";
import NewCollection from "./pages/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import MyAccount from "./pages/MyAccount";
import Games from "./pages/Games";
import TimedChallenges from "./pages/TimedChallenges";
import Reports from "./pages/Reports";
import BadgesAchievements from "./pages/BadgesAchievements";

const App: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [hideSidebar, setHideSidebar] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const hiddenRoutes = ["/", "/fullscreen-display", "/math-collection"];
    setHideSidebar(hiddenRoutes.includes(location.pathname));
  }, [location.pathname]);

  return (
    <Auth0ProviderWithHistory>
      <ErrorBoundary>
        <div
          className={`min-h-screen ${theme.className} ${isFullScreen ? "fullscreen" : ""} ${theme.isDarkMode ? "dark" : ""}`}
        >
          <Navbar />
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
        </div>
      </ErrorBoundary>
    </Auth0ProviderWithHistory>
  );
};

export default App;
