import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import FullScreenDisplay from "./components/FullScreenDisplay";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <div className={`app-container ${theme.className}`}>
        <Router>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: '250px' }}>
            <Routes>
              <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/fullscreen-display" element={<FullScreenDisplay />} />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
