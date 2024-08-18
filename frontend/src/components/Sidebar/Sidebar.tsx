import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="sidebar">
      <ul>
        {isAuthenticated ? (
          <>
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
          </>
        ) : (
          <>
            <li>
              <button type="button" onClick={() => loginWithRedirect()}>Log In</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
