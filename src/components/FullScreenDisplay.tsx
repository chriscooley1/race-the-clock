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
  const { sequence, speed } = location.state;
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
    navigate("/your-collections"); // Navigate back to YourCollections
  };

  return (
    <div
      className={`fullscreen-container ${theme.className}`}
      style={{ color: theme.textColor }} // Use the text color from the theme
    >
      <button className="back-button" type="button" onClick={handleBack}>
        Back
      </button>
      <h1 className="fullscreen-text">{sequence[index]}</h1> {/* Ensure this renders strings */}
    </div>
  );
};

export default FullScreenDisplay;
