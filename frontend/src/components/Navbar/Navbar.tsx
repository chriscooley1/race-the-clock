import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/login");
    setMenuOpen(false);
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
