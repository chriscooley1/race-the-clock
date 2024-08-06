import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { saveCollection } from "../api"; // Import API function

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, sequence } = location.state;
  const [items, setItems] = useState<{ id: number; name: string }[]>(
    sequence.map((name, index) => ({ id: index + 1, name }))
  ); // Initialize with sequence
  const [newItem, setNewItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(10);
  const [dropdownValue, setDropdownValue] = useState<string>("");

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem(""); // Reset new item input field
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    try {
      // Construct a single API call with all the data
      const collectionData = items.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      await saveCollection(
        1,
        collectionName,
        collectionData,
        isPublic ? "public" : "private"
      ); // Replace 1 with actual userId
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
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
    setItems([...items, ...letters.map((name, index) => ({ id: items.length + index + 1, name }))]);
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from(
      { length: quantity },
      () => Math.floor(Math.random() * 100).toString()
    );
    setItems([...items, ...numbers.map((name, index) => ({ id: items.length + index + 1, name }))]);
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
    setItems([...items, ...alphabet.map((name, index) => ({ id: items.length + index + 1, name }))]);
  };

  const generateNumberSequence = () => {
    const numbers = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
    setItems([...items, ...numbers.map((name, index) => ({ id: items.length + index + 1, name }))]);
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
    <div className="collection-final-step-container">
      <h1>Collection: {collectionName}</h1>
      <h2>Step 3 - Fill Out Collection Body</h2>
      <p>To add another item to this Collection, click the add button below.</p>
      <div className="add-item-container">
        <button className="add-button" type="button" onClick={handleAddItem}>
          +
        </button>
        <span>New Item</span>
        <input
          type="text"
          className="custom-input"
          placeholder="New Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        {items.map((item) => (
          <div key={item.id} className="item-container">
            <span>{item.name}</span>
            <button
              className="remove-button"
              type="button"
              onClick={() => handleRemoveItem(item.id)}
            >
              x
            </button>
          </div>
        ))}
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

      <button
        className="save-button"
        type="button"
        onClick={handleSaveCollection}
      >
        Save Collection
      </button>
    </div>
  );
};

export default CollectionFinalStep;
