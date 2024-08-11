import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, colorSchemes } from "../context/ThemeContext"; // Import colorSchemes
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
  const { sequence, speed, textColor, shuffle } = location.state;
  const { theme, setTheme } = useTheme();
  const [index, setIndex] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<string[]>([]);

  // Function to shuffle the sequence
  const shuffleArray = (array: string[]): string[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    onEnterFullScreen();

    // Shuffle the sequence if shuffle is true
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
    const defaultTheme = colorSchemes[0]; // Reset to the default theme
    setTheme(defaultTheme);
    navigate("/your-collections");
  };

  return (
    <div
      className={`fullscreen-container ${theme.className || ''}`}
      style={{ color: textColor || theme.textColor, backgroundColor: theme.backgroundColor, overflow: "hidden" }}
    >
      <button className="back-button" type="button" onClick={handleBack}>
        Back
      </button>
      <h1 className="fullscreen-text">{shuffledSequence[index]}</h1> {/* Render shuffled or normal sequence */}
    </div>
  );
};

export default FullScreenDisplay;
