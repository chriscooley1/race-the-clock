import React, { useState, useEffect } from "react";

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
    setMinutes(mins);
    setSeconds(secs);
  }, [currentSettings.speed]);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains("bg-black")) {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleStartClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={handleBackgroundClick}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-gray-800 shadow-lg">
        <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition duration-300" onClick={onClose}>
          X
        </button>
        <h1 className="text-2xl font-bold mb-4">{collectionName}</h1>
        <p className="mb-4">Please select settings for the session</p>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-2">
              <label htmlFor="minutes" className="mr-2">Minutes:</label>
              <label htmlFor="seconds">Seconds:</label>
            </div>
            <div className="flex justify-between w-full">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-24 p-2 border border-gray-300 rounded"
                placeholder="Minutes"
                title="Minutes"
                min={0}
                onKeyDown={handleKeyDown}
              />
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="w-24 p-2 border border-gray-300 rounded"
                placeholder="Seconds"
                title="Seconds"
                min={0}
                max={59}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="shuffle"
              checked={shuffle}
              onChange={() => setShuffle(!shuffle)}
              className="mr-2 h-5 w-5"
              title="Shuffle Collection"
            />
            <label htmlFor="shuffle">Shuffle Collection</label>
          </div>
          <button
            type="button"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            onClick={handleStartClick}
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSettingsModal;
