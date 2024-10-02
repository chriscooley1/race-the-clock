import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="bg-light-pink fixed left-0 top-[50px] z-40 h-[calc(100vh-50px)] w-[250px] overflow-y-auto shadow-md dark:bg-gray-700">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/your-collections"
              className="block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
            >
              Your Collections
            </Link>
          </li>
          <li>
            <Link
              to="/new-collection"
              className="block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
            >
              New Collection
            </Link>
          </li>
          <li>
            <Link
              to="/discover-collections"
              className="block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
            >
              Discover Collections
            </Link>
          </li>
          <li>
            <Link
              to="/name-generator"
              className="block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
            >
              Name Generator
            </Link>
          </li>
          <li>
            <Link
              to="/resources"
              className="block rounded px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-pink-200 dark:text-white dark:hover:bg-gray-600"
            >
              Resources
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
