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
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [answerDisplayTime, setAnswerDisplayTime] = useState(3);
  const [stopCondition, setStopCondition] = useState("collection");
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
    return (minutes * 60 + seconds) * 1000;
  };

  const handleStartClick = () => {
    const calculatedSpeed = calculateSpeed();
    console.log("Starting session with timer values:", timerMinutes, timerSeconds); // Debug log
    onStart(
      minutes,
      seconds,
      shuffle,
      calculatedSpeed,
      currentSettings.textColor,
      answerDisplayTime * 1000, // Convert to milliseconds
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
        className="w-full max-w-sm rounded-lg p-4 shadow-xl"
        style={{
          backgroundColor:
            theme.displayBackgroundColor || theme.backgroundColor,
          color: theme.displayTextColor || theme.textColor,
        }}
      >
        <h2 className="mb-2 text-center text-xl font-bold">{collectionName}</h2>
        <div className="space-y-3">
          <div className="flex flex-col items-center">
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
          {showAnswerDisplayTime && (
            <div className="flex flex-col items-center">
              <label htmlFor="answerDisplayTime" className="mb-1">
                Answer Display Time (seconds):
              </label>
              <input
                type="number"
                id="answerDisplayTime"
                value={answerDisplayTime}
                onChange={(e) =>
                  setAnswerDisplayTime(parseInt(e.target.value) || 3)
                }
                className="w-20 rounded border border-gray-300 p-1 text-sm"
                placeholder="Seconds"
                title="Answer Display Time"
                min={1}
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
                setStopCondition(e.target.value);
                if (e.target.value === "timer") {
                  setTimerMinutes(0); // Reset timer minutes when switching to timer
                  setTimerSeconds(0); // Reset timer seconds when switching to timer
                }
              }}
              className="rounded border border-gray-300 p-1 text-sm"
            >
              <option value="collection">End on Collection</option>
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
                  className="w-20 rounded border border-gray-300 p-1 text-sm"
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
                  className="w-20 rounded border border-gray-300 p-1 text-sm"
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
