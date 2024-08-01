import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { createCollection } from "../api";

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await createCollection(1, name, isPublic ? "public" : "private"); // replace 1 with actual userId
      navigate("/collection-setup", { state: { collectionName: name } });
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  return (
    <div className="new-collection-container">
      <h1>New Collection</h1>
      <div>
        <label>Step 1 - Collection Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
        />
      </div>
      <div>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label>I want to share my collection publicly</label>
      </div>
      <button onClick={handleCreate}>Next</button>
    </div>
  );
};

export default NewCollection;