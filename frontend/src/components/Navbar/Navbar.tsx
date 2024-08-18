import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";
import Profile from "../Profile";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth0();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleBack = () => {
    navigate("/your-collections");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      {location.pathname === "/fullscreen-display" && (
        <button type="button" className="back-button" onClick={handleBack}>
          Back
        </button>
      )}
      <div className="navbar-title">Race The Clock</div>

      <div className="hamburger-menu" onClick={handleMenuToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && (
        <div className="menu" ref={menuRef}>
          {isAuthenticated ? (
            <>
              <button type="button" onClick={() => handleNavigate("/my-account")}>
                My Account
              </button>
              <button type="button" onClick={() => handleNavigate("/settings")}>
                Settings
              </button>
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      )}
      {isAuthenticated && <Profile />}
    </div>
  );
};

export default Navbar;
