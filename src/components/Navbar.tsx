import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { setToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-title">Race The Clock</div> {/* Add the title */}
      {isAuthenticated && (
        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
