import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  sortOption: string;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDuplicateCollection: () => void;
  setShowFeedback: (show: boolean) => void;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
  sortOption,
  onSortChange,
  onDuplicateCollection,
  setShowFeedback,
}) => {
  const navigate = useNavigate();
  const categories = [
    "All Collections",
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 rounded border border-black px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              <span>{selectedCategory || "Categories"}</span>
              <span className="ml-2">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => {
                      onSelectCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-lg transition-colors duration-300 hover:bg-gray-100 ${
                      selectedCategory === category ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="sortSelect" className="mr-2 text-sm">
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={onSortChange}
              className="font-teacher w-40 rounded border border-black bg-white p-2 text-base text-black"
            >
              <option value="name">Name</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="category">Category</option>
              <option value="date">Date</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onDuplicateCollection}
            className="rounded border border-black bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white transition duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
          >
            Duplicate Collection
          </button>
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="rounded border border-black bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white transition duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
          >
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsNavBar;
