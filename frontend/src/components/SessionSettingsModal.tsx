import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface SessionSettingsModalProps {
  collectionName: string;
  onClose: () => void;
  onStart: (
    min: number,
    sec: number,
    shuffle: boolean,
    speed: number,
    textColor: string,
    answerDisplayTime: number,
    stopCondition: string,
    timerMinutes: number,
    timerSeconds: number,
  ) => void;
  currentSettings: {
    speed: number;
    textColor: string;
  };
  category: string;
  type: string;
}

const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
  collectionName,
  onClose,
  onStart,
  currentSettings,
  category,
  type,
}) => {
  const [minutes, setMinutes] = useState<number | "">(() => {
    const savedMinutes = localStorage.getItem("lastUsedMinutes");
    return savedMinutes ? parseInt(savedMinutes) : 0;
  });
  const [seconds, setSeconds] = useState<number | "">(() => {
    const savedSeconds = localStorage.getItem("lastUsedSeconds");
    return savedSeconds ? parseFloat(savedSeconds) : 0;
  });
  const [shuffle, setShuffle] = useState(false);
  const [answerDisplayTime, setAnswerDisplayTime] = useState<number | "">(
    () => {
      const savedTime = localStorage.getItem("lastUsedAnswerDisplayTime");
      return savedTime ? parseInt(savedTime) : 3;
    },
  );
  const [stopCondition, setStopCondition] = useState(() => {
    const savedStopCondition = localStorage.getItem("lastUsedStopCondition");
    return savedStopCondition || "collection";
  });
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const showAnswerDisplayTime =
    category === "Number Sense" ||
    (category === "Math" && type === "mathProblems");

  const { theme } = useTheme();

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
    const mins = typeof minutes === "number" ? minutes : 0;
    const secs = typeof seconds === "number" ? seconds : 0;
    return (mins * 60 + secs) * 1000;
  };

  const handleStartClick = () => {
    const calculatedSpeed = calculateSpeed();
    const finalAnswerDisplayTime =
      typeof answerDisplayTime === "number" ? answerDisplayTime : 3;

    onStart(
      typeof minutes === "number" ? minutes : 0,
      typeof seconds === "number" ? seconds : 0,
      shuffle,
      calculatedSpeed,
      currentSettings.textColor,
      finalAnswerDisplayTime * 1000, // Convert to milliseconds
      stopCondition,
      timerMinutes,
      timerSeconds,
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
      <div
        className="relative w-full max-w-sm rounded-lg p-4 shadow-xl"
        style={{
          backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
          color: theme.isDarkMode ? "#FFFFFF" : "#000000",
        }}
      >
        <button
          type="button"
          className="absolute right-2 top-2 rounded border border-black bg-red-500 px-2 py-1 text-white transition duration-300 hover:bg-red-600" // Positioned in the upper right corner
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="mb-2 text-center text-xl font-bold">{collectionName}</h2>
        <div className="space-y-3">
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm text-gray-600">
              Set how long each item will be displayed during the session:
            </p>
            <div className="flex w-full justify-around p-2">
              <label htmlFor="minutes" className="mr-2">
                Minutes:
              </label>
              <label htmlFor="seconds">Seconds:</label>
            </div>
            <div className="flex w-full justify-around p-1">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => {
                  const val = e.target.value;
                  setMinutes(val === "" ? "" : parseInt(val) || 0);
                }}
                className="w-20 rounded border border-black p-1 text-sm"
                placeholder="Min"
                title="Minutes"
                min={0}
                style={{
                  backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
                  color: theme.isDarkMode ? "#FFFFFF" : "#000000",
                }}
                onKeyDown={handleKeyDown}
              />
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => {
                  const val = e.target.value;
                  setSeconds(val === "" ? "" : parseFloat(val) || 0);
                }}
                className="w-20 rounded border border-black p-1 text-sm"
                placeholder="Sec"
                title="Seconds"
                min={0}
                max={59}
                step="0.1"
                style={{
                  backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
                  color: theme.isDarkMode ? "#FFFFFF" : "#000000",
                }}
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
          {showAnswerDisplayTime && (
            <div className="flex flex-col items-center">
              <label htmlFor="answerDisplayTime" className="mb-1">
                Answer Display Time (seconds):
              </label>
              <input
                type="number"
                id="answerDisplayTime"
                value={answerDisplayTime}
                onChange={(e) => {
                  const val = e.target.value;
                  const newTime = val === "" ? "" : parseInt(val) || 3;
                  setAnswerDisplayTime(newTime);
                  if (typeof newTime === "number") {
                    localStorage.setItem(
                      "lastUsedAnswerDisplayTime",
                      newTime.toString(),
                    );
                  }
                }}
                className="w-20 rounded border border-black p-1 text-sm"
                placeholder="Seconds"
                title="Answer Display Time"
                min={1}
                style={{
                  backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
                  color: theme.isDarkMode ? "#FFFFFF" : "#000000",
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          <div className="flex flex-col items-center">
            <label className="mb-1">Stop Condition:</label>
            <select
              aria-label="Select stop condition"
              value={stopCondition}
              onChange={(e) => {
                const selectedCondition = e.target.value;
                setStopCondition(selectedCondition);
                localStorage.setItem(
                  "lastUsedStopCondition",
                  selectedCondition,
                );
                if (selectedCondition === "timer") {
                  setTimerMinutes(0);
                  setTimerSeconds(0);
                }
              }}
              className="rounded border border-black p-1 text-sm"
            >
              <option value="collection">End When Collection Completes</option>
              <option value="timer">End on Timer</option>
            </select>
          </div>
          {stopCondition === "timer" && (
            <div className="flex flex-col items-center">
              <div className="flex w-full justify-around p-2">
                <label htmlFor="timerMinutes" className="mr-2">
                  Timer Minutes:
                </label>
                <label htmlFor="timerSeconds">Timer Seconds:</label>
              </div>
              <div className="flex w-full justify-around p-1">
                <input
                  type="number"
                  id="timerMinutes"
                  value={timerMinutes}
                  onChange={(e) =>
                    setTimerMinutes(parseInt(e.target.value) || 0)
                  }
                  className="w-20 rounded border border-black p-1 text-sm"
                  placeholder="Min"
                  title="Timer Minutes"
                  min={0}
                />
                <input
                  type="number"
                  id="timerSeconds"
                  value={timerSeconds}
                  onChange={(e) =>
                    setTimerSeconds(parseInt(e.target.value) || 0)
                  }
                  className="w-20 rounded border border-black p-1 text-sm"
                  placeholder="Sec"
                  title="Timer Seconds"
                  min={0}
                  max={59}
                />
              </div>
            </div>
          )}
          <button
            type="button"
            className="rounded border border-black bg-green-500 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-green-600"
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
