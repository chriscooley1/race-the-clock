import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/your-collections">Your Collections</Link></li>
        <li><Link to="/discover-collections">Discover Collections</Link></li>
        <li><button>New Collection</button></li>
      </ul>
      <ul>
        <li><Link to="/your-collections">Your Collections</Link></li>
        <li><Link to="/discover-collections">Discover Collections</Link></li>
        <li><button>New Collection</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
