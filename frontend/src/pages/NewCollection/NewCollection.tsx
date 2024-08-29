import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewCollection.css";
import "../../App.css"; // Global styles for the app

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("Math");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const categories = ["Math", "Language Arts", "More"];

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    console.log("Navigating to collection setup with:", {
      name,
      category,
      isPublic,
    });
    // Navigate to the setup step with the initial collection details
    navigate("/collection-setup", {
      state: { collectionName: name, isPublic, category },
    });
  };

  return (
    <div className="new-collection-container">
      <h1>New Collection</h1>
      <div>
        <label htmlFor="collectionName">Step 1 - Collection Name</label>
        <input
          type="text"
          id="collectionName"
          className="new-custom-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
          title="Collection Name"
        />
      </div>
      <div className="new-centered-input">
        <label htmlFor="categorySelect">Category:</label>
        <select
          id="categorySelect"
          className="new-custom-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="new-checkbox-container">
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
      <button type="button" onClick={handleNext} className="new-styled-button">
        Next
      </button>
    </div>
  );
};

export default NewCollection;
