import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSequence } from "../api";
import { useTheme } from "../context/ThemeContext";
import Display from "./Display";
import "../App.css";

interface SettingsProps {
  onUpdate: (sequence: string[], speed: number) => void;
  userId: number;
}

const speedOptions = [
  { label: "0.25 seconds", value: 250 },
  { label: "0.5 seconds", value: 500 },
  { label: "0.75 seconds", value: 750 },
  { label: "1 second", value: 1000 },
  { label: "1.5 seconds", value: 1500 },
  { label: "2 seconds", value: 2000 }
];

const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Green", value: "#00ff00" },
  { label: "Yellow", value: "#ffff00" },
  // Add more colors as needed
];

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState<string>("");
  const [speed, setSpeed] = useState<number>(500);
  const [quantity, setQuantity] = useState<number>(10);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [showCharacters, setShowCharacters] = useState(true);  // Manage visibility
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const sequence = input.split(",").map((item) => item.trim());
    onUpdate(sequence, speed);
    localStorage.setItem("inputSequence", input);
    try {
      const response = await createSequence(userId, "My Sequence", input);
      console.log("Sequence saved successfully:", response.data);
      setShowCharacters(false);  // Hide characters on navigation
      navigate("/fullscreen-display", { state: { sequence, speed } });
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

  const generateAlphabetSequence = () => {
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    setInput(alphabet.join(", "));
  };

  const generateNumberSequence = () => {
    const numbers = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
    setInput(numbers.join(", "));
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdownValue(event.target.value);
    switch (event.target.value) {
      case "randomLetters":
        generateRandomLetters();
        break;
      case "randomNumbers":
        generateRandomNumbers();
        break;
      case "alphabetSequence":
        generateAlphabetSequence();
        break;
      case "numberSequence":
        generateNumberSequence();
        break;
      default:
        break;
    }
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextColor(event.target.value);
    setTheme({ ...theme, textColor: event.target.value });
  };

  return (
    <div className={`settings-container ${theme.className}`}>
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
      <div className="button-container">
        <button className="save-button" onClick={handleUpdate}>Save</button>
      </div>
      {/* Optionally render Display here if needed */}
      {/* <Display sequence={sequence} speed={speed} showCharacters={showCharacters} /> */}
    </div>
  );
};

export default Settings;
