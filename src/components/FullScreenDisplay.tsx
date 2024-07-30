import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../App.css";

interface FullScreenDisplayProps {
  sequence: string[];
  speed: number;
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
}

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({ sequence, speed, onEnterFullScreen, onExitFullScreen }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    onEnterFullScreen();
    return () => onExitFullScreen();
  }, [onEnterFullScreen, onExitFullScreen]);

  useEffect(() => {
    if (sequence.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % sequence.length);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [sequence, speed]);

  const handleBack = () => {
    navigate("/home"); // Navigate back to HomePage
  };

  return (
    <div className={`fullscreen-container ${theme.className}`}>
      <button className="back-button" type="button" onClick={handleBack}>Back</button>
      <h1 style={{ color: theme.textColor }}>{sequence[index]}</h1>
    </div>
  );
};

export default FullScreenDisplay;
