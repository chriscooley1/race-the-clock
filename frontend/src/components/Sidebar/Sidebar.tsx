import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-[250px] bg-light-pink shadow-md h-[calc(100vh-50px)] fixed top-[50px] left-0 overflow-y-auto z-40">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/your-collections" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
              Your Collections
            </Link>
          </li>
          <li>
            <Link to="/new-collection" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
              New Collection
            </Link>
          </li>
          <li>
            <Link to="/discover-collections" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
              Discover Collections
            </Link>
          </li>
          <li>
            <Link to="/name-generator" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
              Name Generator
            </Link>
          </li>
          <li>
            <Link to="/resources" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
              Resources
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
