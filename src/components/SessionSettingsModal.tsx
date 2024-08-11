import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { themes, textColorOptions } from "../context/ThemeContext";

const speedOptions = [
  { label: "0.25 seconds", value: 250 },
  { label: "0.5 seconds", value: 500 },
  { label: "0.75 seconds", value: 750 },
  { label: "1 second", value: 1000 },
  { label: "1.5 seconds", value: 1500 },
  { label: "2 seconds", value: 2000 },
  { label: "3 seconds", value: 3000 },
  { label: "4 seconds", value: 4000 },
  { label: "5 seconds", value: 5000 },
];

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
  const [selectedTheme, setSelectedTheme] = useState(
    currentSettings.theme.className
  );

  useEffect(() => {
    const defaultTheme = themes.find(
      (theme) => theme.className === selectedTheme
    );
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
    if ((event.target as HTMLElement).className === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-container">
        <button type="button" className="close-button" onClick={onClose}>
          X
        </button>
        <h1>{collectionName}</h1>
        <p>Please select settings for the session</p>
        <div className="modal-content">
          <div className="time-setting">
            <div className="time-labels">
              <label htmlFor="minutes">Minutes:</label>
              <label htmlFor="seconds">Seconds:</label>
            </div>
            <div className="time-inputs">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="custom-input"
                placeholder="Enter minutes"
                title="Minutes"
                min={0}
              />
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="custom-input"
                placeholder="Enter seconds"
                title="Seconds"
                min={0}
                max={59}
              />
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="shuffle"
                checked={shuffle}
                onChange={() => setShuffle(!shuffle)}
                title="Shuffle Collection"
              />
              <label htmlFor="shuffle">Shuffle Collection</label>
            </div>
          </div>
          <div className="settings">
            <label htmlFor="speed">Speed:</label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              title="Select speed"
            >
              {speedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="textColor">Text Color:</label>
            <select
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              title="Select text color"
            >
              {textColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="theme">Theme:</label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              title="Select theme"
            >
              {themes.map((theme) => (
                <option key={theme.className} value={theme.className}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="start-session-button"
              onClick={() =>
                onStart(
                  minutes,
                  seconds,
                  shuffle,
                  speed,
                  textColor,
                  selectedTheme
                )
              }
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
