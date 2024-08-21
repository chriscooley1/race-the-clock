import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Sidebar.css";
import "../../App.css"; // Global styles for the app

const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  // Check if the current route is the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <div className="sidebar">
      {!isLandingPage && isAuthenticated && (  // Hide sidebar content on the LandingPage
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
