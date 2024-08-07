import React, { useState } from "react";

const SessionSettingsModal = ({ onClose, onStart }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h1>Please select an amount of time to display the items in the collection</h1>
        <div className="modal-content">
          <div className="time-setting">
            <label>Minutes</label>
            <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </div>
          <div className="time-setting">
            <label>Seconds</label>
            <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
          </div>
          <div className="shuffle-setting">
            <label>
              <input type="checkbox" checked={shuffle} onChange={() => setShuffle(!shuffle)} />
              Shuffle Collection
            </label>
          </div>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={() => onStart(minutes, seconds, shuffle)}>Start Session</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSettingsModal;
