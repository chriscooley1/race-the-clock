import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

interface DisplayProps {
  sequence: string[];
  speed: number;
}

const Display: React.FC<DisplayProps> = ({ sequence, speed }) => {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme(); // Access theme from ThemeContext

  useEffect(() => {
    if (sequence.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % sequence.length);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [sequence, speed]);

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <h1>{sequence[index]}</h1>
    </div>
  );
};

export default Display;
