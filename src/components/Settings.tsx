import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSequence } from "../api";
import { useTheme } from "../context/ThemeContext";
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
  { label: "2 seconds", value: 2000 },
];

const Settings: React.FC<SettingsProps> = ({ onUpdate, userId }) => {
  const [input, setInput] = useState<string>("");
  const [speed, setSpeed] = useState<number>(500);
  const [quantity, setQuantity] = useState<number>(10);
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const savedSequence = localStorage.getItem("inputSequence");
    const savedSpeed = localStorage.getItem("sequenceSpeed");
    const savedTextColor = localStorage.getItem("sequenceTextColor");
    if (savedSequence) {
      setInput(savedSequence);
    }
    if (savedSpeed) {
      setSpeed(Number(savedSpeed));
    }
    if (savedTextColor) {
      setTheme((prevTheme) => ({ ...prevTheme, textColor: savedTextColor }));
    }
  }, [setTheme]);

  const handleUpdate = async () => {
    const sequence = input.split(",").map((item) => item.trim());
    onUpdate(sequence, speed);
    localStorage.setItem("inputSequence", input);
    localStorage.setItem("sequenceSpeed", speed.toString());
    localStorage.setItem("sequenceTextColor", theme.textColor);
    try {
      const response = await createSequence(userId, "My Sequence", input);
      console.log("Sequence saved successfully:", response);
      navigate("/fullscreen-display", {
        state: { sequence, speed, textColor: theme.textColor },
      });
    } catch (error: any) {
      console.error(
        "Error saving sequence:",
        error.response?.data || error.message || error
      );
    }
  };

  const generateRandomLetters = () => {
    const letters = Array.from({ length: quantity }, () => {
      const isUpperCase = Math.random() > 0.5;
      const charCode = isUpperCase
        ? 65 + Math.floor(Math.random() * 26) // Uppercase letters
        : 97 + Math.floor(Math.random() * 26); // Lowercase letters
      return String.fromCharCode(charCode);
    });
    setInput(letters.join(", "));
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from(
      { length: quantity },
      () => Math.floor(Math.random() * 100).toString()
    );
    setInput(numbers.join(", "));
  };

  const generateAlphabetSequence = () => {
    const uppercase = Array.from(
      { length: 26 },
      (_, i) => String.fromCharCode(65 + i)
    );
    const lowercase = Array.from(
      { length: 26 },
      (_, i) => String.fromCharCode(97 + i)
    );
    const alphabet = [...uppercase, ...lowercase];
    setInput(alphabet.join(", "));
  };

  const generateNumberSequence = () => {
    const numbers = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
    setInput(numbers.join(", "));
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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

  return (
    <div className={`settings-container ${theme.className}`}>
      <div className="input-field">
        <label htmlFor="sequenceInput">Sequence (comma-separated):</label>
        <textarea
          id="sequenceInput"
          className="custom-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter letters or words separated by commas"
        />
      </div>
      <div className="input-field">
        <label htmlFor="speedInput">Speed:</label>
        <select
          id="speedInput"
          className="custom-input"
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
          className="custom-input"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
        />
      </div>
      <div className="input-field">
        <label htmlFor="dropdownSelect">Generate Sequence:</label>
        <select
          id="dropdownSelect"
          className="custom-input"
          value={dropdownValue}
          onChange={handleDropdownChange}
        >
          <option value="">Select...</option>
          <option value="randomLetters">Random Letters</option>
          <option value="randomNumbers">Random Numbers</option>
          <option value="alphabetSequence">Alphabet Sequence</option>
          <option value="numberSequence">Number Sequence</option>
        </select>
      </div>
      <div className="button-container">
        <button className="save-button" type="button" onClick={handleUpdate}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
