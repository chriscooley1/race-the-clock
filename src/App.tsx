import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullScreenDisplay from "./components/FullScreenDisplay";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
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
          {!hideSidebar && <Sidebar />}
          <div style={{ flex: 1, marginLeft: hideSidebar ? '0' : '250px' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} /> {/* Default landing page */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<PrivateRoute element={<HomePage handleSettingsUpdate={handleSettingsUpdate} handleHistoryLoad={handleHistoryLoad} userId={1} />} />} />
              <Route
                path="/fullscreen-display"
                element={<PrivateRoute element={<FullScreenDisplay sequence={sequence} speed={speed} onEnterFullScreen={() => handleFullScreenDisplay(true)} onExitFullScreen={() => handleFullScreenDisplay(false)} />} />}
              />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
