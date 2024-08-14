import React, { useState } from "react";
import { generateRandomNames } from "../utils/RandomGenerators"; // Import the function

const NameGenerator: React.FC = () => {
  const [nameCount, setNameCount] = useState<number>(1);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  const handleGenerateNames = () => {
    const names = generateRandomNames(nameCount);
    setGeneratedNames(names);
  };

  return (
    <div className="name-generator-container">
      <h1>Name Generator</h1>
      <div className="centered-input">
        <label htmlFor="nameCount">Number of Names:</label>
        <input
          type="number"
          id="nameCount"
          value={nameCount}
          min={1}
          onChange={(e) => setNameCount(parseInt(e.target.value, 10))}
          className="custom-input"
          placeholder="Enter number of names"
          title="Enter the number of names"
        />
      </div>
      <button
        type="button"
        onClick={handleGenerateNames}
        className="styled-button"
      >
        Generate Names
      </button>
      {generatedNames.length > 0 && (
        <div>
          <h3>Generated Names:</h3>
          <ul>
            {generatedNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NameGenerator;
