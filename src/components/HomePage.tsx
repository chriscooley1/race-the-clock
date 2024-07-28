import React from 'react';
import ThemeSelector from './ThemeSelector';
import Settings from './Settings';
import History from './History';
import Display from './Display';
import FullScreenDisplay from './FullScreenDisplay';

const handleSettingsUpdate = (sequence: string[], speed: number) => {
  // Handle sequence and speed update logic here
};

const handleHistoryLoad = (sequence: string[]) => {
  // Handle loading the sequence from history
};

// Example data; replace with actual state or props as needed
const sequence = ['A', 'B', 'C', 'D'];
const speed = 500; // Example speed (in milliseconds)
const userId = 123; // Example userId

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <ThemeSelector />
      <Settings onUpdate={handleSettingsUpdate} userId={userId} />
      <History onLoad={handleHistoryLoad} />
      <Display sequence={sequence} speed={speed} />
      <FullScreenDisplay />
    </div>
  );
};

export default HomePage;
