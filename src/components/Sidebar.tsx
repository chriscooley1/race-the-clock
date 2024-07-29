import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">HomePage</Link></li> {/* Ensure the path here matches the route in App.tsx */}
        <li><Link to="/your-collections">Your Collections</Link></li>
        <li><Link to="/discover-collections">Discover Collections</Link></li>
        <li><button>New Collection</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
