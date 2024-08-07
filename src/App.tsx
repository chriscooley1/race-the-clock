import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullScreenDisplay from "./pages/FullScreenDisplay";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import LandingPage from "./components/LandingPage";
import YourCollections from "./components/YourCollections";
import NewCollection from "./pages/NewCollection";
import DiscoverCollections from "./pages/DiscoverCollections";
import CollectionSetup from "./pages/CollectionSetup";
import CollectionFinalStep from "./pages/CollectionFinalStep";
import NameGenerator from "./pages/NameGenerator";
import Resources from "./components/Resources";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar"; // Import Navbar
import "./App.css";

const App: React.FC = () => {
  const { theme } = useTheme();
  const [sequence, setSequence] = React.useState<string[]>([]);
  const [speed, setSpeed] = React.useState<number>(500);
  const [hideSidebar, setHideSidebar] = React.useState<boolean>(false);

  const handleSettingsUpdate = (newSequence: string[], newSpeed: number) => {
    setSequence(newSequence);
    setSpeed(newSpeed);
  };

  const handleHistoryLoad = (seq: string[]) => {
    setSequence(seq);
  };

  const handleFullScreenDisplay = (hide: boolean) => {
    setHideSidebar(hide);
  };

  return (
    <AuthProvider>
      <div className={`app-container ${theme.className}`}>
        <Router basename="/letter-reader">
          <Navbar /> {/* Add Navbar */}
          {!hideSidebar && <Sidebar />}
          <div style={{ flex: 1, marginLeft: hideSidebar ? '0' : '250px' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<PrivateRoute element={<HomePage handleSettingsUpdate={handleSettingsUpdate} handleHistoryLoad={handleHistoryLoad} userId={1} />} />} />
              <Route path="/fullscreen-display" element={<PrivateRoute element={<FullScreenDisplay sequence={sequence} speed={speed} onEnterFullScreen={() => handleFullScreenDisplay(true)} onExitFullScreen={() => handleFullScreenDisplay(false)} />} />} />
              <Route path="/your-collections" element={<PrivateRoute element={<YourCollections />} />} />
              <Route path="/new-collection" element={<PrivateRoute element={<NewCollection />} />} />
              <Route path="/collection-setup" element={<PrivateRoute element={<CollectionSetup />} />} />
              <Route path="/collection-final-step" element={<PrivateRoute element={<CollectionFinalStep />} />} />
              <Route path="/discover-collections" element={<PrivateRoute element={<DiscoverCollections />} />} />
              <Route path="/name-generator" element={<PrivateRoute element={<NameGenerator />} />} />
              <Route path="/resources" element={<PrivateRoute element={<Resources />} />} />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
