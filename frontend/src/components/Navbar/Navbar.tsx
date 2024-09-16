import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";
import "../../App.css";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isPaused, onPauseResume }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();

  const handleMenuToggle = () => {
    console.log("Toggling menu. Current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logout({ logoutParams: { returnTo: window.location.origin } });
    setMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
    setMenuOpen(false);
  };

  const handleBack = () => {
    navigate("/your-collections");
  };

  const handleTitleClick = () => {
    navigate("/your-collections");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("Clicked outside menu, closing...");
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("Cleaning up event listener for handleClickOutside");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      {location.pathname === "/fullscreen-display" && (
        <>
          <button type="button" className="nav-back-button" onClick={handleBack}>
            Back
          </button>
          {onPauseResume && (
            <button type="button" className="nav-pause-button" onClick={onPauseResume}>
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
        </>
      )}
      <div className="navbar-title clickable" onClick={handleTitleClick}>
        Race The Clock
      </div>
      <div className="hamburger-menu" onClick={handleMenuToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && (
        <div className="nav-menu" ref={menuRef}>
          <button type="button" onClick={() => handleNavigate("/my-account")}>
            My Account
          </button>
          <button type="button" onClick={() => handleNavigate("/settings")}>
            Settings
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
