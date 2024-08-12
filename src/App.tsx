import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullScreenDisplay from "./pages/FullScreenDisplay";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import YourCollections from "./pages/YourCollections";
import NewCollection from "./pages/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator";
import Resources from "./components/Resources";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import MyAccount from "./pages/MyAccount";
import "./App.css";

const App: React.FC = () => {
  const { theme } = useTheme();
  const [hideSidebar, setHideSidebar] = React.useState<boolean>(false);

  const handleFullScreenDisplay = (hide: boolean) => {
    setHideSidebar(hide);
  };

  return (
    <AuthProvider>
      <div className={`app-container ${theme.className}`}>
        <Router basename="/letter-reader">
          <Navbar />
          <div className="layout">
            {!hideSidebar && <Sidebar />}
            <div className={`main-content ${hideSidebar ? 'without-sidebar' : 'with-sidebar'}`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/fullscreen-display"
                  element={
                    <PrivateRoute
                      element={
                        <FullScreenDisplay
                          onEnterFullScreen={() => handleFullScreenDisplay(true)}
                          onExitFullScreen={() => handleFullScreenDisplay(false)}
                        />
                      }
                    />
                  }
                />
                <Route
                  path="/your-collections"
                  element={<PrivateRoute element={<YourCollections />} />}
                />
                <Route
                  path="/new-collection"
                  element={<PrivateRoute element={<NewCollection />} />}
                />
                <Route
                  path="/collection-setup"
                  element={<PrivateRoute element={<CollectionSetup />} />}
                />
                <Route
                  path="/collection-final-step"
                  element={<PrivateRoute element={<CollectionFinalStep />} />}
                />
                <Route
                  path="/discover-collections"
                  element={<PrivateRoute element={<DiscoverCollections />} />}
                />
                <Route
                  path="/name-generator"
                  element={<PrivateRoute element={<NameGenerator />} />}
                />
                <Route
                  path="/resources"
                  element={<PrivateRoute element={<Resources />} />}
                />
                <Route 
                  path="/settings" 
                  element={<PrivateRoute element={<Settings />} />} 
                />  // New route for Settings
                <Route 
                  path="/my-account" 
                  element={<PrivateRoute element={<MyAccount />} />} 
                />  // New route for My Account
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
