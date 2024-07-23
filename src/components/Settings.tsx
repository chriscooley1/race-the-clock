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
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <input
        type="number"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Settings;
