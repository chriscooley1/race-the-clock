import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { generateRandomLetters, generateRandomNumbers } from "../utils/RandomGenerators";

const CollectionSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic } = location.state || {};

  const [file, setFile] = useState<File | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [type, setType] = useState<string>("letters");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const generateRandomSequence = () => {
    let generatedSequence: string[] = [];
    if (type === "letters") {
      generatedSequence = generateRandomLetters(itemCount);
    } else if (type === "numbers") {
      generatedSequence = generateRandomNumbers(itemCount);
    }
    setSequence(generatedSequence);
  };

  const handleNext = () => {
    if (!collectionName) {
      alert("Collection name is missing. Please go back and enter a name.");
      return;
    }

    console.log("Collection Name:", collectionName);
    console.log("Is Public:", isPublic);
    console.log("File:", file);
    console.log("Item Count:", itemCount);
    console.log("Generated Sequence:", sequence);

    navigate("/collection-final-step", {
      state: { collectionName, isPublic, itemCount, file, sequence },
    });
  };

  return (
    <div className="collection-setup-container">
      <h1>Collection: {collectionName}</h1>
      <h2>Step 2 - Set Up Collection Body</h2>
      <div>
        <label htmlFor="fileUpload">
          Upload a file to create a collection from
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          title="Choose a file to upload"
        />
      </div>
      <p>- OR -</p>
      <div>
        <label htmlFor="itemCount">
          Input a number of Items to add to this Collection
        </label>
        <input
          type="number"
          id="itemCount"
          className="custom-input"
          value={itemCount}
          min={1}
          onChange={(e) => {
            const count = parseInt(e.target.value, 10);
            setItemCount(count);
          }}
          placeholder="Enter number of items"
          title="Enter the number of items"
        />
      </div>
      <div>
        <label htmlFor="typeSelect">Type:</label>
        <select
          id="typeSelect"
          className="custom-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="letters">Letters</option>
          <option value="numbers">Numbers</option>
        </select>
      </div>
      <button type="button" onClick={generateRandomSequence} className="styled-button">
        Generate Random Sequence
      </button>
      <button type="button" onClick={handleNext} className="styled-button">
        Next
      </button>
      {sequence.length > 0 && (
        <div>
          <h3>Generated Sequence:</h3>
          <p>{sequence.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionSetup;
