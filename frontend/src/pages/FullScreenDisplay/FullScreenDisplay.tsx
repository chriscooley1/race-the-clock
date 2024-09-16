import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./FullScreenDisplay.css";
import "../../App.css";
import Navbar from "../../components/Navbar/Navbar";

interface FullScreenDisplayProps {
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
}

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({
  onEnterFullScreen,
  onExitFullScreen,
}) => {
  const location = useLocation();
  const { sequence, speed, shuffle } = location.state;
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false); // State for pausing
  const [intervalId, setIntervalId] = useState<number | null>(null); // Use "number" instead of "NodeJS.Timeout"

  const shuffleArray = (array: string[]): string[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    console.log("Entering FullScreenDisplay with sequence:", sequence);
    onEnterFullScreen();

    if (shuffle) {
      console.log("Shuffling sequence...");
      setShuffledSequence(shuffleArray(sequence));
    } else {
      setShuffledSequence(sequence);
    }

    document.documentElement.style.setProperty("--display-text-color", theme.displayTextColor || theme.textColor);
    document.documentElement.style.setProperty("--background-color", theme.displayBackgroundColor || theme.backgroundColor);

    return () => {
      console.log("Exiting FullScreenDisplay");
      document.documentElement.style.setProperty("--display-text-color", theme.textColor);
      document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
      onExitFullScreen(); // Ensure this is called to reset sidebar
    };
  }, [onEnterFullScreen, onExitFullScreen, sequence, shuffle, theme]);

  useEffect(() => {
    if (shuffledSequence.length > 0 && !isPaused) {
      console.log("Starting sequence display with speed:", speed);
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
      }, speed);
      setIntervalId(interval as unknown as number); // Cast interval to "number" for the browser
      return () => clearInterval(interval);
    }
  }, [shuffledSequence, speed, isPaused]);

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      clearInterval(intervalId!); // Clear the interval if pausing
      setIsPaused(true);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prevIndex) => (prevIndex - 1 + shuffledSequence.length) % shuffledSequence.length);
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    handleNext(e);
  };

  return (
    <>
      <Navbar isPaused={isPaused} onPauseResume={handlePauseResume} />
      <div className="fullscreen-container" onClick={handleScreenClick}>
        <h1 className="fullscreen-text">{shuffledSequence[index]}</h1>
        <button type="button" className="nav-button left" onClick={handlePrevious}>←</button>
        <button type="button" className="nav-button right" onClick={handleNext}>→</button>
      </div>
    </>
  );
};

export default FullScreenDisplay;
