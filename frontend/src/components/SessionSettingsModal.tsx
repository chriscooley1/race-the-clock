import React, { useState, useEffect } from "react";

interface SessionSettingsModalProps {
  collectionName: string;
  onClose: () => void;
  onStart: (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string,
  ) => void;
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
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const calculateSpeed = () => {
    return (minutes * 60 + seconds) * 1000;
  };

  const handleStartClick = () => {
    const calculatedSpeed = calculateSpeed();
    onStart(
      minutes,
      seconds,
      shuffle,
      calculatedSpeed,
      currentSettings.textColor,
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleStartClick();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800">
        {" "}
        {/* Reduced max-width and padding */}
        <h2 className="mb-2 text-center text-xl font-bold">
          {collectionName}
        </h2>{" "}
        {/* Reduced margin-bottom */}
        <div className="space-y-3">
          {" "}
          {/* Reduced space between items */}
          <div className="flex flex-col items-center">
            <div className="p-2 flex w-full justify-around">
              {" "}
              {/* Reduced margin-bottom */}
              <label htmlFor="minutes" className="mr-2">
                Minutes:
              </label>
              <label htmlFor="seconds">Seconds:</label>
            </div>
            <div className="flex p-1 w-full justify-around">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-20 rounded border border-gray-300 p-1 text-sm"
                placeholder="Min"
                title="Minutes"
                min={0}
                onKeyDown={handleKeyDown}
              />
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="w-20 rounded border border-gray-300 p-1 text-sm"
                placeholder="Sec"
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
              className="mr-2 size-4"
              title="Shuffle Collection"
            />
            <label htmlFor="shuffle" className="text-sm">
              Shuffle Collection
            </label>
          </div>
          <button
            type="button"
            className="rounded bg-green-500 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-green-600"
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
