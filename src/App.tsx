import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Ensure this is imported for your styles

// Import your components
import YourCollections from './components/YourCollections';
import DiscoverCollections from './components/DiscoverCollections';
import Home from './components/HomePage';
// import NewCollection from './components/NewCollection';
import FullScreenDisplay from './components/FullScreenDisplay'; // Assuming you have this component

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="sidebar">
          <h2>Menu</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/your-collections">Your Collections</Link></li>
            <li><Link to="/discover-collections">Discover Collections</Link></li>
            <li><button className="new-collection-btn">New Collection</button></li>
          </ul>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/your-collections" element={<YourCollections />} />
            <Route path="/discover-collections" element={<DiscoverCollections />} />
            {/* <Route path="/new-collection" element={<NewCollection />} /> */}
            <Route path="/fullscreen" element={<FullScreenDisplay />} /> {/* Add route for fullscreen display */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
