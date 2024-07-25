import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "../App.css";

interface DisplayProps {
  sequence: string[];
  speed: number;
  showCharacters: boolean;  // New prop to control visibility
}

const Display: React.FC<DisplayProps> = ({ sequence, speed, showCharacters }) => {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (sequence.length > 0 && showCharacters) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % sequence.length);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [sequence, speed, showCharacters]);

  return (
    <div className="display-container" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      {showCharacters && <h1>{sequence[index]}</h1>}  {/* Conditional rendering */}
    </div>
  );
};

export default Display;
