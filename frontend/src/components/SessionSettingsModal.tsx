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
    if ((event.target as HTMLElement).classList.contains("bg-black")) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-gray-800 shadow-lg">
        <button
          type="button"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-red-500 text-white transition duration-300 hover:bg-red-600"
          onClick={onClose}
        >
          X
        </button>
        <h1 className="mb-4 text-2xl font-bold">{collectionName}</h1>
        <p className="mb-4">Please select settings for the session</p>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex w-full justify-between">
              <label htmlFor="minutes" className="mr-2">
                Minutes:
              </label>
              <label htmlFor="seconds">Seconds:</label>
            </div>
            <div className="flex w-full justify-between">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-24 rounded border border-gray-300 p-2"
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
                className="w-24 rounded border border-gray-300 p-2"
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
              className="mr-2 size-5"
              title="Shuffle Collection"
            />
            <label htmlFor="shuffle">Shuffle Collection</label>
          </div>
          <button
            type="button"
            className="w-full rounded bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
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
