import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="tab-container">
        <Link to="/your-collections" className="tab">Your Collections</Link>
        <Link to="/discover-collections" className="tab">Discover Collections</Link>
      </div>
      <button className="sidebar-button">New Collection</button>
    </div>
  );
};

export default Sidebar;
