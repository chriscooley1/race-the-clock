import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { createSequence } from "../api";

const speedOptions = [
  { label: "0.25 seconds", value: 250 },
  { label: "0.5 seconds", value: 500 },
  { label: "0.75 seconds", value: 750 },
  { label: "1 second", value: 1000 },
  { label: "1.5 seconds", value: 1500 },
  { label: "2 seconds", value: 2000 },
];

const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Green", value: "#00ff00" },
  { label: "Yellow", value: "#ffff00" },
];

interface SettingsProps {
  onUpdate: (newSequence: string[], newSpeed: number) => void;
  userId: number;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState<string>("");
  const [speed, setSpeed] = useState<number>(500);
  const [quantity, setQuantity] = useState<number>(10);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const sequence = input.split(",").map((item) => item.trim());
    localStorage.setItem("inputSequence", input);
    try {
      await createSequence(userId, "My Sequence", input);
      onUpdate(sequence, speed);
      navigate("/fullscreen-display", { state: { sequence, speed } });
    } catch (error) {
      console.error("Error saving sequence:", error);
    }
  };

  const generateSequence = (type: string) => {
    let newSequence: string[] = [];
    switch (type) {
      case "randomLetters":
        newSequence = Array.from({ length: quantity }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
        break;
      case "randomNumbers":
        newSequence = Array.from({ length: quantity }, () => Math.floor(Math.random() * 100).toString());
        break;
      case "alphabetSequence":
        newSequence = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        break;
      case "numberSequence":
        newSequence = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
        break;
    }
    setInput(newSequence.join(", "));
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdownValue(event.target.value);
    generateSequence(event.target.value);
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextColor(event.target.value);
    setTheme({ ...theme, textColor: event.target.value });
  };

  return (
    <div className={`settings-container ${theme.className}`}>
      <h1>Letter Reader</h1>
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
        <label htmlFor="speedInput">Speed:</label>
        <select
          id="speedInput"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          {speedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
      <div className="input-field">
        <label htmlFor="generateDropdown">Generate Sequence:</label>
        <select id="generateDropdown" value={dropdownValue} onChange={handleDropdownChange}>
          <option value="">Select an option</option>
          <option value="randomLetters">Random Letters</option>
          <option value="randomNumbers">Random Numbers</option>
          <option value="alphabetSequence">Alphabet Sequence</option>
          <option value="numberSequence">Number Sequence</option>
        </select>
      </div>
      <div className="input-field">
        <label htmlFor="textColorSelect">Text Color:</label>
        <select id="textColorSelect" value={textColor} onChange={handleTextColorChange}>
          {textColorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleUpdate}>Save</button>
    </div>
  );
};

export default Settings;
