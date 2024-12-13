import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTour } from "../context/TourContext";
import { useCart } from "../context/CartContext";
import cartIcon from "../assets/cart.jpeg";
import FeedbackIcon from "./FeedbackIcon";
import Cart from "./Cart";

interface CollectionsNavBarProps {
  setShowFeedback: (show: boolean) => void;
  onStartTour: () => void;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  setShowFeedback,
  onStartTour,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const { logout, loginWithRedirect } = useAuth0();
  const { isGuidedTourEnabled } = useTour();
  const { items, removeItem, updateQuantity } = useCart();
  const isHomePage = location.pathname === "/";

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleLogin = () => {
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections" } });
  };

  return (
    <div className="top-navbar-height inset-x-0 z-[51] bg-white text-black shadow-md dark:bg-gray-800">
      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Left side - Navigation Items */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/your-collections")}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => navigate("/about")}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => navigate("/shop")}
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
              <span className="ml-2"></span>
            </button>

            {isAccountDropdownOpen && (
              <div className="absolute left-0 top-full z-[60] mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
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
                    navigate("/settings");
                    setIsAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg hover:bg-gray-100"
                >
                  Settings
                </button>
              </div>
            )}
          </div>

          {/* Resources Button */}
          <button
            type="button"
            onClick={() => {
              navigate("/resources", { replace: false });
              setIsAccountDropdownOpen(false);
            }}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Resources
          </button>

          <button
            type="button"
            onClick={() => navigate("/credits")}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            Credits
          </button>

          {/* Add Guided Tour Button */}
          {isGuidedTourEnabled && (
            <button
              type="button"
              onClick={onStartTour}
              className="rounded border border-black bg-blue-500 px-3 py-2 text-base font-bold text-white transition-colors duration-300 hover:bg-blue-600"
            >
              Start Tour
            </button>
          )}
        </div>

        {/* Right side - Login/Logout, Cart and Feedback */}
        <div className="relative mt-2 flex items-center space-x-10">
          <button
            type="button"
            onClick={isHomePage ? handleLogin : handleLogout}
            className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
          >
            {isHomePage ? "Login" : "Logout"}
          </button>
          <div className="scale-[1.75] transition-transform hover:scale-[1.85]">
            <FeedbackIcon onClick={() => setShowFeedback(true)} />
          </div>
          <div className="flex items-center space-x-6">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative scale-[1.75] transition-transform hover:scale-[1.85]"
            >
              <img src={cartIcon} alt="Shopping Cart" className="size-8" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

export default CollectionsNavBar;
