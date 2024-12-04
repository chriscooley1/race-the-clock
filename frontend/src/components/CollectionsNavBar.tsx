import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectionsNavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  return (
    <div className="inset-x-0 top-navbar-height z-[51] bg-white text-black shadow-md dark:bg-gray-800">
      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Left side - Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Home Button */}
          <button
            type="button"
            onClick={() => navigate('/your-collections')}
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="flex items-center space-x-2 rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              <span>Account</span>
              <span className="ml-2">▼</span>
            </button>

            {isAccountDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
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
      </div>
    </div>
  );
};

export default CollectionsNavBar;
