import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";

// Import your page components here
import LandingPage from "./pages/LandingPage/LandingPage";
import FullScreenDisplay from "./pages/FullScreenDisplay/FullScreenDisplay";
import YourCollections from "./pages/YourCollections/YourCollections";
import NewCollection from "./pages/NewCollection/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator/NameGenerator";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings/Settings";
import MyAccount from "./pages/MyAccount/MyAccount";
import MathCollectionPage from "./pages/MathCollectionPage/MathCollectionPage";

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
        <div className={`min-h-screen ${theme.className} ${isFullScreen ? "fullscreen" : ""} ${theme.isDarkMode ? "dark" : ""}`}>
          <Navbar />
          <div className="flex pt-[70px]">
            {!hideSidebar && <Sidebar />}
            <div className={`flex-grow ${hideSidebar ? "ml-0" : "ml-[250px]"} main-content-area`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/fullscreen-display"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <PrivateRoute element={
                        <FullScreenDisplay 
                          onEnterFullScreen={() => setIsFullScreen(true)}
                          onExitFullScreen={() => setIsFullScreen(false)}
                        />
                      } />
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
                  path="/math-collection"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <PrivateRoute element={<MathCollectionPage />} />
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
