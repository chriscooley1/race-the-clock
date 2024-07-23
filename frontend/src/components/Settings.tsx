import React, { useState, useEffect } from "react";
import { createSequence } from '../api';
import { useTheme } from "../context/ThemeContext"; // Import useTheme

interface SettingsProps {
  onUpdate: (sequence: string[], speed: number) => void;
  userId: number;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(500);
  const [quantity, setQuantity] = useState(10); // New state for quantity

  const { theme } = useTheme(); // Access theme from ThemeContext

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
    const letters = Array.from({ length: quantity }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    setInput(letters.join(", "));
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: quantity }, () => Math.floor(Math.random() * 100).toString());
    setInput(numbers.join(", "));
  };

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <div>
        <label htmlFor="sequenceInput">Sequence (comma-separated):</label>
        <textarea
          id="sequenceInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter letters or words separated by commas"
          style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
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
          style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
        />
      </div>
      <div>
        <label htmlFor="quantityInput">Quantity:</label>
        <input
          id="quantityInput"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
          min="1"
          style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
        />
      </div>
      <div>
        <button onClick={generateRandomLetters} style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>Generate Random Letters</button>
        <button onClick={generateRandomNumbers} style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>Generate Random Numbers</button>
      </div>
      <button onClick={handleUpdate} style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>Update</button>
    </div>
  );
};

export default Settings;
