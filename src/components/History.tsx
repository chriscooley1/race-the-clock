import React, { useState } from "react";
import "../App.css";

interface HistoryProps {
  onLoad: (sequence: string[]) => void;
}

const History: React.FC<HistoryProps> = ({ onLoad }) => {
  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem("sequenceHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const handleLoad = (sequence: string) => {
    const newSequence = sequence.split(",").map(item => item.trim());
    onLoad(newSequence);
    setHistory(prevHistory => [...prevHistory, sequence]);
  };

  return (
    <div className="history-container">
      {history.map((sequence, index) => (
        <button type="button" key={index} className="history-button" onClick={() => handleLoad(sequence)}>
          {sequence}
        </button>
      ))}
    </div>
  );
};

export default History;
