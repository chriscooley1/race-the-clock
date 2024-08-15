import React, { useState } from "react";
import axios from "axios";

// Import the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateCollectionForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleCreateCollection = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/collections`, {
        name,
        description,
        status: isPublic ? "public" : "private", // Set status based on checkbox
      });
      console.log("Collection created:", response.data);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  return (
    <div>
      <h1>Create Collection</h1>
      <div>
        <label htmlFor="collectionName">Collection Name</label>
        <input
          type="text"
          id="collectionName"
          placeholder="Enter collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="collectionDescription">Description</label>
        <textarea
          id="collectionDescription"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <input
          type="checkbox"
          id="isPublicCheckbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublicCheckbox">I want to share my collection publicly</label>
      </div>
      <button type="button" onClick={handleCreateCollection}>Create Collection</button>
    </div>
  );
};

export default CreateCollectionForm;
