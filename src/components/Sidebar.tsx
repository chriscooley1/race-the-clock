import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">HomePage</Link></li>
        <li><Link to="/your-collections">Your Collections</Link></li>
        <li><Link to="/discover-collections">Discover Collections</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
