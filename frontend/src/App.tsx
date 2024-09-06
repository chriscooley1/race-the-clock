import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import YourCollections from "./pages/YourCollections/YourCollections";
import NewCollection from "./pages/NewCollection/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator/NameGenerator";
import Resources from "./pages/Resources";
import { useTheme } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Settings from "./pages/Settings/Settings";
import MyAccount from "./pages/MyAccount/MyAccount";
import "./App.css";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load FullScreenDisplay and other components
const FullScreenDisplay = lazy(() => import("./pages/FullScreenDisplay/FullScreenDisplay"));

const App: React.FC = () => {
  const { theme } = useTheme();
  const [hideSidebar, setHideSidebar] = React.useState<boolean>(false);
  const location = useLocation();

  React.useEffect(() => {
    // Hide sidebar on the LandingPage
    setHideSidebar(location.pathname === "/");
  }, [location.pathname]);

  const handleFullScreenDisplay = (hide: boolean) => {
    console.log("Setting hideSidebar to:", hide);
    setHideSidebar(hide);
    console.log("hideSidebar state after setting:", hideSidebar);
  };
  
  // Reset sidebar visibility whenever navigating away from fullscreen
  React.useEffect(() => {
    console.log("Route changed to:", location.pathname);
    console.log("hideSidebar state before resetting:", hideSidebar);
    
    if (location.pathname !== "/fullscreen-display") {
      setHideSidebar(false); // Ensure the sidebar reappears on route change
    }
  
    console.log("hideSidebar state after resetting:", hideSidebar);
  }, [location.pathname]);

  console.log("Rendering App, hideSidebar state:", hideSidebar);

  return (
    <Auth0ProviderWithHistory>
      <ErrorBoundary>
        <div className={`app-container ${theme.className}`}>
          <Navbar />
          <div className="layout">
            {!hideSidebar && <Sidebar />}
            <div className={`main-content ${hideSidebar ? "without-sidebar" : "with-sidebar"}`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/fullscreen-display"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <PrivateRoute
                        element={
                          <FullScreenDisplay
                            onEnterFullScreen={() => handleFullScreenDisplay(true)}
                            onExitFullScreen={() => handleFullScreenDisplay(false)}
                          />
                        }
                      />
                    </Suspense>
                  }
                />
                <Route path="/your-collections" element={<PrivateRoute element={<YourCollections />} />} />
                <Route path="/new-collection" element={<PrivateRoute element={<NewCollection />} />} />
                <Route path="/collection-setup" element={<PrivateRoute element={<CollectionSetup />} />} />
                <Route path="/collection-final-step" element={<PrivateRoute element={<CollectionFinalStep />} />} />
                <Route path="/discover-collections" element={<PrivateRoute element={<DiscoverCollections />} />} />
                <Route path="/name-generator" element={<PrivateRoute element={<NameGenerator />} />} />
                <Route path="/resources" element={<PrivateRoute element={<Resources />} />} />
                <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
                <Route path="/my-account" element={<PrivateRoute element={<MyAccount />} />} />
              </Routes>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </Auth0ProviderWithHistory>
  );
};

export default App;
