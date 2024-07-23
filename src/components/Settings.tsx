import React, { useState } from "react";

interface SettingsProps {
  onUpdate: (sequence: string[], speed: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate }) => {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(500);

  const handleUpdate = () => {
    const sequence = input.split(",").map(item => item.trim());
    onUpdate(sequence, speed);
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Settings;
