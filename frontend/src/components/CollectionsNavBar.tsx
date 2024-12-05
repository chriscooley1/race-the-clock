import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import cartIcon from "../assets/cart.jpeg";
import FeedbackIcon from "./FeedbackIcon";

interface CollectionsNavBarProps {
  setShowFeedback: (show: boolean) => void;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  setShowFeedback,
}) => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    if (isAccountDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountDropdownOpen]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setIsAccountDropdownOpen(false);
  };

  return (
    <div className="top-navbar-height inset-x-0 z-[51] bg-white text-black shadow-md dark:bg-gray-800">
      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Left side - Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Home Button */}
          <button
            type="button"
            onClick={() => navigate("/your-collections")}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Home
          </button>

          {/* About Button */}
          <button
            type="button"
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            About
          </button>

          {/* Shop Button */}
          <button
            type="button"
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Shop
          </button>

          {/* Account Dropdown */}
          <div className="relative" ref={accountDropdownRef}>
            <button
              type="button"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="flex items-center space-x-2 rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              <span>Account</span>
              <span className="ml-2">▼</span>
            </button>

            {isAccountDropdownOpen && (
              <div className="absolute left-0 top-full z-[60] mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/my-account");
                    setIsAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  My Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/reports");
                    setIsAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  Reports
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/badges-achievements");
                    setIsAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  Badges
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/settings");
                    setIsAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Resources Button */}
          <button
            type="button"
            onClick={() => {
              console.log("Resources button clicked - attempting navigation");
              navigate("/resources", { replace: false });
              console.log("Navigation completed");
              setIsAccountDropdownOpen(false);
            }}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Resources
          </button>
        </div>

        {/* Right side - Cart and Feedback */}
        <div className="relative flex items-center space-x-8">
          <div className="hover:scale-160 scale-150 transition-transform">
            <FeedbackIcon onClick={() => setShowFeedback(true)} />
          </div>
          <button
            type="button"
            className="hover:scale-160 scale-150 transition-transform"
          >
            <img src={cartIcon} alt="Shopping Cart" className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsNavBar;
