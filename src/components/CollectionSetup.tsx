import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const CollectionSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const { collectionName } = location.state;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    console.log("File:", file);
    console.log("Item Count:", itemCount);
    navigate("/collection-final-step", { state: { collectionName } });
  };

  return (
    <div className="collection-setup-container">
      <h1>Collection: {collectionName}</h1>
      <h2>Step 2 - Set Up Collection Body</h2>
      <div>
        <label>Upload a file to create a collection from</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <p>- OR -</p>
      <div>
        <label>Input a number of Items to add to this Collection</label>
        <input
          type="number"
          value={itemCount}
          min={1}
          onChange={(e) => setItemCount(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default CollectionSetup;
