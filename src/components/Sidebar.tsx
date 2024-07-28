import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Determine whether to show the sidebar or not
  const isFullScreen = location.pathname === '/full-screen-display';

  return (
    <div className={`sidebar ${isFullScreen ? 'hidden' : ''}`}>
      <ul>
        <li>
          <Link to="/your-collections">Your Collections</Link>
        </li>
        <li>
          <Link to="/discover-collections">Discover Collections</Link>
        </li>
        <li>
          <button className="new-collection-button">New Collection</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
