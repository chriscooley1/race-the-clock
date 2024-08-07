import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../themeOptions";

const SessionSettingsModal = ({ collectionName, onClose, onStart, currentSettings }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const { setTheme } = useTheme(); // Global theme context for updating the theme
  const [speed, setSpeed] = useState(currentSettings.speed);
  const [textColor, setTextColor] = useState(currentSettings.textColor);
  const [selectedTheme, setSelectedTheme] = useState(currentSettings.theme.className);

  // Function to handle theme change
  const handleThemeChange = (themeClassName) => {
    const newTheme = themes.find((theme) => theme.className === themeClassName);
    if (newTheme) {
      setTheme(newTheme); // This sets the global theme
      setSelectedTheme(themeClassName);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h2>{collectionName}</h2> {/* Display the collection name */}
        <h1>Please select settings for the session</h1>
        <div className="modal-content">
          <div className="time-setting">
            <label>Minutes:</label>
            <input type="number" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))} />
            <label>Seconds:</label>
            <input type="number" value={seconds} onChange={(e) => setSeconds(parseInt(e.target.value))} />
            <div className="checkbox-container">
              <input type="checkbox" checked={shuffle} onChange={() => setShuffle(!shuffle)} />
              <label>Shuffle Collection</label>
            </div>
          </div>
          <div className="settings">
            <label>Speed:</label>
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={250}>0.25 seconds</option>
              <option value={500}>0.5 seconds</option>
              <option value={750}>0.75 seconds</option>
              <option value={1000}>1 second</option>
              <option value={1500}>1.5 seconds</option>
              <option value={2000}>2 seconds</option>
            </select>
            <label>Text Color:</label>
            <select value={textColor} onChange={(e) => setTextColor(e.target.value)}>
              {textColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label>Theme:</label>
            <select value={selectedTheme} onChange={(e) => handleThemeChange(e.target.value)}>
              {themes.map((theme) => (
                <option key={theme.className} value={theme.className}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button 
              type="button" 
              className="start-session-button" 
              onClick={() => onStart(minutes, seconds, shuffle, speed, textColor, selectedTheme)}>
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSettingsModal;
