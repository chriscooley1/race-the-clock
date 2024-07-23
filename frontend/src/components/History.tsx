import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface HistoryProps {
  onLoad: (sequence: string[]) => void;
}

const History: React.FC<HistoryProps> = ({ onLoad }) => {
  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem("sequenceHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const { theme } = useTheme(); // Access theme from ThemeContext

  const handleLoad = (sequence: string) => {
    const newSequence = sequence.split(",").map(item => item.trim());
    onLoad(newSequence); // Assuming onLoad is a prop function to set the sequence
    setHistory(prevHistory => [...prevHistory, sequence]); // Update history with new sequence
  };

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      {history.map((sequence, index) => (
        <button
          key={index}
          onClick={() => handleLoad(sequence)}
          style={{ color: theme.color, backgroundColor: theme.backgroundColor }}
        >
          {sequence}
        </button>
      ))}
    </div>
  );
};

export default History;
