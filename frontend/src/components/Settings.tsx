import React, { useState, useEffect } from "react";

interface SettingsProps {
  onUpdate: (sequence: string[], speed: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate }) => {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    const savedInput = localStorage.getItem("inputSequence");
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  const handleUpdate = () => {
    const sequence = input.split(",").map((item) => item.trim());
    onUpdate(sequence, speed);
    localStorage.setItem("inputSequence", input);
  };

  return (
    <div>
      <div>
        <label htmlFor="sequenceInput">Sequence (comma-separated):</label>
        <textarea
          id="sequenceInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter letters or words separated by commas"
        />
      </div>
      <div>
        <label htmlFor="speedInput">Speed (milliseconds):</label>
        <input
          id="speedInput"
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          placeholder="Enter speed in milliseconds"
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Settings;
