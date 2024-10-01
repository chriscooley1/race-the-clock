import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";
import "../../App.css";

interface NavbarProps {
  isPaused?: boolean;
  onPauseResume?: () => void;
  onBack?: () => void;
  hasBackButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isPaused, onPauseResume, onBack, hasBackButton }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();
  const { theme, toggleDarkMode } = useTheme();

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
    <div className="fixed top-0 w-full h-[50px] flex justify-between items-center bg-[#cceeff] dark:bg-gray-800 shadow-md px-2 md:px-5 z-50">
      {/* Dark mode toggle */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
      >
        {theme.isDarkMode ? "☀️" : "🌙"}
      </button>

      {(location.pathname === "/fullscreen-display" || hasBackButton) && (
        <>
          <button
            type="button"
            className="bg-red-400 text-white border-none py-2 px-4 rounded cursor-pointer text-base transition-colors duration-300 hover:bg-red-600 mr-5"
            onClick={onBack || handleBack}
          >
            Back
          </button>
          {onPauseResume && (
            <button
              type="button"
              className="bg-green-500 text-white border-none py-2 px-4 rounded cursor-pointer text-base transition-colors duration-300 hover:bg-green-600 ml-2"
              onClick={onPauseResume}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
        </>
      )}
      <div className="flex-grow text-center text-lg md:text-xl font-bold text-gray-800 dark:text-white cursor-pointer" onClick={handleTitleClick}>
        Race The Clock
      </div>
      <div className="cursor-pointer flex flex-col justify-between w-[30px] h-[25px]" onClick={handleMenuToggle}>
        <div className="h-[3px] bg-gray-800 transition-all duration-300"></div>
        <div className="h-[3px] bg-gray-800 transition-all duration-300"></div>
        <div className="h-[3px] bg-gray-800 transition-all duration-300"></div>
      </div>
      {menuOpen && (
        <div ref={menuRef} className="absolute top-[50px] right-0 w-full md:w-auto bg-white dark:bg-gray-700 shadow-md rounded-b md:rounded z-[1001] p-2">
          <button type="button" className="w-full text-left py-3 px-4 text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300" onClick={() => handleNavigate("/my-account")}>
            My Account
          </button>
          <button type="button" className="w-full text-left py-3 px-4 text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300" onClick={() => handleNavigate("/settings")}>
            Settings
          </button>
          <button type="button" className="w-full text-left py-3 px-4 text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
