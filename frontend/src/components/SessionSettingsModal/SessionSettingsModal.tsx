import React, { useState, useEffect } from "react";
import "./SessionSettingsModal.css";
import "../../App.css"; // Global styles for the app

interface SessionSettingsModalProps {
  collectionName: string;
  onClose: () => void;
  onStart: (min: number, sec: number, shuffle: boolean, speed: number, textColor: string) => void;
  currentSettings: {
    speed: number;
    textColor: string;
  };
}

const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
  collectionName,
  onClose,
  onStart,
  currentSettings,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    // Initialize minutes and seconds based on the currentSettings speed
    const totalSeconds = currentSettings.speed / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setMinutes(mins);
    setSeconds(secs);
  }, [currentSettings.speed]);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).className === "modal-background") {
      onClose();
    }
  };

  const calculateSpeed = () => {
    return (minutes * 60 + seconds) * 1000;
  };

  const handleStartClick = () => {
    const calculatedSpeed = calculateSpeed();
    onStart(minutes, seconds, shuffle, calculatedSpeed, currentSettings.textColor);
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
          <div className="modal-actions">
            <button
              type="button"
              className="start-session-button"
              onClick={handleStartClick}
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
