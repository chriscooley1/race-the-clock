import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; 
import "../App.css";

interface FullScreenDisplayProps {
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
}

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({
  onEnterFullScreen,
  onExitFullScreen,
}) => {
  const navigate = useNavigate();
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

    return () => onExitFullScreen();
  }, [onEnterFullScreen, onExitFullScreen, sequence, shuffle]);

  useEffect(() => {
    if (shuffledSequence.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [shuffledSequence, speed]);

  const handleBack = () => {
    navigate("/your-collections");
  };

  return (
    <div
      className={`fullscreen-container ${theme.className || ""}`}
      style={{
        color: theme.displayTextColor || theme.textColor,  // Apply the displayTextColor here
        backgroundColor: theme.displayBackgroundColor || theme.backgroundColor,  // Apply the displayBackgroundColor here
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1
        className="fullscreen-text"
        style={{
          fontSize: "50vw",
          lineHeight: "0.8",
          margin: "0",
        }}
      >
        {shuffledSequence[index]}
      </h1>
    </div>
  );
};

export default FullScreenDisplay;
