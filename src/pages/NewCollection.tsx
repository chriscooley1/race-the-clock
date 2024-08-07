import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNext = () => {
    // Navigate to the setup step with the initial collection details
    navigate("/collection-setup", { state: { collectionName: name, isPublic } });
  };

  return (
    <div className="new-collection-container">
      <h1>New Collection</h1>
      <div>
        <label htmlFor="collectionName">Step 1 - Collection Name</label>
        <input
          type="text"
          id="collectionName"
          className="custom-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
          title="Collection Name"
        />
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="publicCheckbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
          title="Share collection publicly"
        />
        <label htmlFor="publicCheckbox">
          I want to share my collection publicly
        </label>
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="styled-button"
      >
        Next
      </button>
    </div>
  );
};

export default NewCollection;
