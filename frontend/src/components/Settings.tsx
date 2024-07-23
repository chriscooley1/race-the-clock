import React, { useState, useEffect } from "react";
import { createSequence } from '../api';
import { useTheme } from '../context/ThemeContext';
import "./Settings.css";

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(500);
  const [quantity, setQuantity] = useState(10);
  const { setTheme } = useTheme();

  const handleUpdate = async () => {
    const sequence = input.split(",").map((item) => item.trim());
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

  const switchToDarkMode = () => {
    setTheme({
      backgroundColor: '#333',
      color: '#fff',
      // other dark theme properties
    });
  };

  const switchToBlueTheme = () => {
    setTheme({
      backgroundColor: '#cceeff',
      color: '#003366',
      // other blue theme properties
    });
  };

  return (
    <div className="settings-container">
      <div className="input-field">
        <label htmlFor="sequenceInput">Sequence (comma-separated):</label>
        <textarea
          id="sequenceInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter letters or words separated by commas"
        />
      </div>
      <div className="input-field">
        <label htmlFor="speedInput">Speed (milliseconds):</label>
        <input
          id="speedInput"
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          placeholder="Enter speed in milliseconds"
        />
      </div>
      <div className="input-field">
        <label htmlFor="quantityInput">Quantity:</label>
        <input
          id="quantityInput"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
          min="1"
        />
      </div>
      <div>
        <button onClick={generateRandomLetters}>Generate Random Letters</button>
        <button onClick={generateRandomNumbers}>Generate Random Numbers</button>
      </div>
      <button onClick={handleUpdate}>Update</button>
      <div>
        <button onClick={switchToDarkMode}>Dark Mode</button>
        <button onClick={switchToBlueTheme}>Blue Theme</button>
      </div>
    </div>
  );
};

export default Settings;
