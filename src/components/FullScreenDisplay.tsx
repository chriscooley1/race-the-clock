import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../App.css";
const FullScreenDisplay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(500);
  useEffect(() => {
    if (location.state) {
      const { sequence: seq, speed: spd } = location.state as { sequence: string[], speed: number };
      console.log("Received state:", { sequence: seq, speed: spd }); // For debugging
      setSequence(seq);
      setSpeed(spd);
    }
  }, [location.state]);
  useEffect(() => {
    if (sequence.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % sequence.length);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [sequence, speed]);
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className={`fullscreen-container ${theme.className}`}>
      <button className="back-button" type="button" onClick={handleBack}>Back</button>
      <h1 style={{ color: theme.textColor }}>{sequence[index]}</h1>
    </div>
  );
};
export default FullScreenDisplay;
