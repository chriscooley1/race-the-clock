import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="bg-alesan fixed left-2 top-2 z-50 rounded-md p-2 md:hidden dark:bg-gray-700 mt-4"
      >
        ☰
      </button>
      <div
        className={`bg-alesan fixed left-0 top-[50px] z-40 h-[calc(100vh-50px)] w-[250px] overflow-y-auto shadow-md transition-transform duration-300 ease-in-out dark:bg-gray-700 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 mt-3`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/your-collections"
                className="your-collections-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Your Collections
              </Link>
            </li>
            <li>
              <Link
                to="/new-collection"
                className="new-collection-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                New Collection
              </Link>
            </li>
            <li>
              <Link
                to="/discover-collections"
                className="discover-collections-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Discover Collections
              </Link>
            </li>
            <li>
              <Link
                to="/name-generator"
                className="name-generator-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Name Generator
              </Link>
            </li>
            <li>
              <Link
                to="/games"
                className="games-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="reports-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Reports
              </Link>
            </li>
            <li>
              <Link
                to="/badges-achievements"
                className="badges-achievements-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Badges & Achievements
              </Link>
            </li>
            <li>
              <Link
                to="/resources"
                className="resources-link block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
              >
                Resources
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
