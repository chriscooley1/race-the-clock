import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../themeOptions";

// Define the prop types for the modal
interface SessionSettingsModalProps {
  collectionName: string;
  onClose: () => void;
  onStart: (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string,
    themeClassName: string
  ) => void;
  currentSettings: {
    speed: number;
    textColor: string;
    theme: {
      className: string;
    };
  };
}

const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
  collectionName,
  onClose,
  onStart,
  currentSettings,
}) => {
  const { setTheme } = useTheme();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [speed, setSpeed] = useState(currentSettings.speed);
  const [textColor, setTextColor] = useState(currentSettings.textColor);
  const [selectedTheme, setSelectedTheme] = useState(currentSettings.theme.className);

  useEffect(() => {
    // Initialize default theme based on the current settings
    const defaultTheme = themes.find((theme) => theme.className === selectedTheme);
    if (defaultTheme) {
      setTheme(defaultTheme);
    }
  }, [setTheme, selectedTheme]);

  const handleThemeChange = (themeClassName: string) => {
    const newTheme = themes.find((theme) => theme.className === themeClassName);
    if (newTheme) {
      setTheme(newTheme);
      setSelectedTheme(themeClassName);
    }
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Close modal if clicked on modal background
    if ((event.target as HTMLElement).className === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-container">
        <h2>{collectionName}</h2>
        <h1>Please select settings for the session</h1>
        <div className="modal-content">
          <div className="time-setting">
            <label>Minutes:</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            />
            <label>Seconds:</label>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={() => setShuffle(!shuffle)}
              />
              <label>Shuffle Collection</label>
            </div>
          </div>
          <div className="settings">
            <label>Speed:</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              {textColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label>Text Color:</label>
            <select
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            >
              {textColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label>Theme:</label>
            <select
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              {themes.map(theme => (
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
              onClick={() => onStart(minutes, seconds, shuffle, speed, textColor, selectedTheme)}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSettingsModal;
