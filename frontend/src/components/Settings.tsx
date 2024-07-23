import React, { useState, useEffect } from "react";
import { createSequence } from '../api';

interface SettingsProps {
  onUpdate: (sequence: string[], speed: number) => void;
  userId: number;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    const savedInput = localStorage.getItem("inputSequence");
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  const handleUpdate = async () => {
    const sequence = input.split(",").map((item) => item.trim());
    console.log("Updating with sequence:", sequence, "and speed:", speed);
    onUpdate(sequence, speed);
    localStorage.setItem("inputSequence", input);
    try {
      const response = await createSequence(userId, "My Sequence", input);
      console.log("Sequence saved successfully:", response.data);
    } catch (error: any) {
      console.error("Error saving sequence:", error.response?.data || error.message || error);
    }
  };

  const generateRandomLetters = () => {
    const letters = Array.from({ length: 10 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    setInput(letters.join(", "));
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100).toString());
    setInput(numbers.join(", "));
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
      <div>
        <button onClick={generateRandomLetters}>Generate Random Letters</button>
        <button onClick={generateRandomNumbers}>Generate Random Numbers</button>
      </div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Settings;
