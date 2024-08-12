import React, { useState, useEffect } from "react";
import { useTheme, colorSchemes } from "../context/ThemeContext";

interface SessionSettingsModalProps {
  collectionName: string;
  onClose: () => void;
  onStart: (min: number, sec: number, shuffle: boolean, speed: number, textColor: string, themeClassName: string) => void;
  currentSettings: {
    speed: number;
    textColor: string;
    theme: {
      className: string;
    };
  };
}

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
  { label: "10 seconds", value: 10000 },
  { label: "30 seconds", value: 30000 },
  { label: "1 minute", value: 60000 },
  { label: "2 minutes", value: 120000 },
  { label: "5 minutes", value: 300000 },
  { label: "10 minutes", value: 600000 }
];

const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
  collectionName,
  onClose,
  onStart,
  currentSettings
}) => {
  const { setTheme } = useTheme();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [speed, setSpeed] = useState(currentSettings.speed);
  const [selectedScheme, setSelectedScheme] = useState(
    colorSchemes.find(scheme => scheme.className === currentSettings.theme.className) || colorSchemes[0]
  );

  useEffect(() => {
    if (selectedScheme) {
      setTheme(selectedScheme);
    }
  }, [setTheme, selectedScheme]);

  useEffect(() => {
    const totalSeconds = speed / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setMinutes(mins);
    setSeconds(secs);
  }, [speed]);

  const handleSchemeChange = (schemeName: string) => {
    const newScheme = colorSchemes.find(scheme => scheme.name === schemeName);
    if (newScheme) {
      setTheme(newScheme);
      setSelectedScheme(newScheme);
    }
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).className === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-container">
        <button type="button" className="close-button" onClick={onClose}>X</button>
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
            <label htmlFor="speed">Speed: </label>
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
            <label htmlFor="colorScheme"> Color Scheme: </label>
            <select
              id="colorScheme"
              value={selectedScheme.name}
              onChange={(e) => handleSchemeChange(e.target.value)}
              title="Select color scheme"
            >
              {colorSchemes.map((scheme) => (
                <option key={scheme.name} value={scheme.name}>
                  {scheme.name}
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
                  selectedScheme.textColor,
                  selectedScheme.name
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
