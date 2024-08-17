import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./FullScreenDisplay.css";

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
    onEnterFullScreen();

    if (shuffle) {
      setShuffledSequence(shuffleArray(sequence));
    } else {
      setShuffledSequence(sequence);
    }

    // Update CSS variables for the theme
    document.documentElement.style.setProperty('--display-text-color', theme.displayTextColor || theme.textColor);
    document.documentElement.style.setProperty('--background-color', theme.displayBackgroundColor || theme.backgroundColor);

    return () => onExitFullScreen();
  }, [onEnterFullScreen, onExitFullScreen, sequence, shuffle, theme]);

  useEffect(() => {
    if (shuffledSequence.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
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
