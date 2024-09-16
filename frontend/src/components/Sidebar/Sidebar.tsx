import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Sidebar.css";
import "../../App.css";

const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  console.log("Current route:", location.pathname);
  // Check if the current route is the landing page
  const isLandingPage = location.pathname === "/";

  // Hide the entire sidebar when on the landing page
  if (isLandingPage) {
    console.log("Landing page detected, hiding sidebar...");
    return null;
  }

  return (
    <div className="sidebar">
      {isAuthenticated && (
        <ul>
          <li>
            <Link to="/your-collections">Your Collections</Link>
          </li>
          <li>
            <Link to="/new-collection">New Collection</Link>
          </li>
          <li>
            <Link to="/discover-collections">Discover Collections</Link>
          </li>
          <li>
            <Link to="/name-generator">Name Generator</Link>
          </li>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
