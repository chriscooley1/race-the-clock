import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, isAuthenticated } = useAuth();

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/home">HomePage</Link>
            </li>
            <li>
              <Link to="/your-collections">Your Collections</Link>
            </li>
            <li>
              <Link to="/discover-collections">Discover Collections</Link>
            </li>
            <li>
              <Link to="/new-collection">New Collection</Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="styled-button" /* Updated class name */
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">HomePage</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Already Registered</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
