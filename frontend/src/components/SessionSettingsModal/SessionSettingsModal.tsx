import React, { useState, useEffect } from "react";
import "./SessionSettingsModal.css";
import "../../App.css";

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
    const totalSeconds = currentSettings.speed / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    console.log("Current settings speed:", currentSettings.speed);
    console.log("Calculated minutes:", mins, "Calculated seconds:", secs);
    setMinutes(mins);
    setSeconds(secs);
  }, [currentSettings.speed]);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains("sess-modal-background")) {
      console.log("Background clicked, closing modal...");
      onClose();
    }
  };

  const calculateSpeed = () => {
    const speed = (minutes * 60 + seconds) * 1000;
    console.log("Calculated speed in ms:", speed);
    return speed;
  };

  const handleStartClick = () => {
    const calculatedSpeed = calculateSpeed();
    console.log("Starting session with:", {
      minutes,
      seconds,
      shuffle,
      calculatedSpeed,
      textColor: currentSettings.textColor,
    });
    onStart(minutes, seconds, shuffle, calculatedSpeed, currentSettings.textColor);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleStartClick();
    }
  };

  return (
    <div className="sess-modal-background" onClick={handleBackgroundClick}>
      <div className="sess-modal-container">
        <button type="button" className="sess-close-button" onClick={onClose}>X</button>
        <h1>{collectionName}</h1>
        <p>Please select settings for the session</p>
        <div className="sess-modal-content">
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
                className="sess-custom-input"
                placeholder="Enter minutes"
                title="Minutes"
                min={0}
                onKeyPress={handleKeyPress}
              />
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="sess-custom-input"
                placeholder="Enter seconds"
                title="Seconds"
                min={0}
                max={59}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="sess-checkbox-container">
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
