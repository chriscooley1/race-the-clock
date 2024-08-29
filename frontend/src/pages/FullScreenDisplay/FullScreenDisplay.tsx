import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./FullScreenDisplay.css";
import "../../App.css"; // Global styles for the app

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
      onExitFullScreen();
    };
  }, [onEnterFullScreen, onExitFullScreen, sequence, shuffle, theme]);

  useEffect(() => {
    if (shuffledSequence.length > 0) {
      console.log("Starting sequence display with speed:", speed);
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % shuffledSequence.length;
          console.log("Displaying item at index:", newIndex);
          return newIndex;
        });
      }, speed);
      return () => clearInterval(interval);
    }
  }, [shuffledSequence, speed]);

  return (
    <div className="fullscreen-container">
      <h1 className="fullscreen-text">
        {shuffledSequence[index]}
      </h1>
    </div>
  );
};

export default FullScreenDisplay;
