import React, { useState } from "react";
import "./NameGenerator.css";
import "../../App.css"; // Global styles for the app

const NameGenerator: React.FC = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState<string | null>(null);

  const handleAddName = () => {
    if (nameInput.trim() !== "") {
      console.log("Adding name:", nameInput.trim());
      setNameList([...nameList, nameInput.trim()]);
      setNameInput(""); // Clear the input after adding
    }
  };

  const handleRemoveName = (index: number) => {
    console.log("Removing name at index:", index);
    const updatedList = nameList.filter((_, i) => i !== index);
    setNameList(updatedList);
  };

  const handleEditName = (index: number, newName: string) => {
    console.log("Editing name at index:", index, "to:", newName.trim());
    const updatedList = [...nameList];
    updatedList[index] = newName.trim();
    setNameList(updatedList);
  };

  const handleGenerateName = () => {
    if (nameList.length > 0) {
      const randomIndex = Math.floor(Math.random() * nameList.length);
      console.log("Generated random name:", nameList[randomIndex]);
      setGeneratedName(nameList[randomIndex]);
    }
  };

  return (
    <div className="name-generator-container">
      <h1>Name Generator</h1>
      <div className="gen-centered-input">
        <label htmlFor="nameInput">Add a Name:</label>
        <input
          type="text"
          id="nameInput"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="gen-custom-input"
          placeholder="Enter a name"
          title="Name Input"
        />
        <button type="button" onClick={handleAddName} className="gen-styled-button">
          Add Name
        </button>
      </div>
      <div className="name-list">
        <h3>Name List:</h3>
        <ul>
          {nameList.map((name, index) => (
            <li key={index}>
              <input
                type="text"
                value={name}
                onChange={(e) => handleEditName(index, e.target.value)}
                className="gen-custom-input"
                placeholder="Edit name" // Placeholder attribute
                title={`Edit name ${index + 1}`} // Title attribute
              />
              <button
                type="button"
                onClick={() => handleRemoveName(index)}
                className="remove-button"
                title={`Remove name ${index + 1}`} // Title attribute
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={handleGenerateName}
        className="gen-styled-button"
        disabled={nameList.length === 0}
        title="Generate a random name from the list" // Title attribute
      >
        Generate Random Name
      </button>
      {generatedName && (
        <div>
          <h3>Generated Name:</h3>
          <p>{generatedName}</p>
        </div>
      )}
    </div>
  );
};

export default NameGenerator;
