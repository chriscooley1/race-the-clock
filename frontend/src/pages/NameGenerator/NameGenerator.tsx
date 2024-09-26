import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./NameGenerator.css";
import "../../App.css";
import NameWheel from "./NameWheel";

const NameGenerator: React.FC = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [nameListId, setNameListId] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  // Remove the unused state

  const loadNameList = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("http://localhost:8000/namelists/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length > 0) {
        const latestNameList = response.data[0];
        setNameListId(latestNameList.namelist_id);
        setNameList(latestNameList.names);
      }
    } catch (error) {
      console.error("Error loading name list:", error);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    loadNameList();
  }, [loadNameList]);

  const saveNameList = async (updatedList: string[] = nameList) => {
    try {
      const token = await getAccessTokenSilently();
      const data = { name: "My Name List", names: updatedList };
      if (nameListId) {
        await axios.put(`http://localhost:8000/namelists/${nameListId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const response = await axios.post("http://localhost:8000/namelists/", data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNameListId(response.data.namelist_id);
      }
    } catch (error) {
      console.error("Error saving name list:", error);
    }
  };

  const handleAddName = () => {
    if (nameInput.trim() !== "") {
      const updatedList = [...nameList, nameInput.trim()];
      setNameList(updatedList);
      setNameInput("");
      saveNameList(updatedList);
    }
  };

  const handleRemoveName = (index: number) => {
    const updatedList = nameList.filter((_, i) => i !== index);
    setNameList(updatedList);
    saveNameList(updatedList);  // Pass the updated list to saveNameList
  };

  const handleEditName = (index: number, newName: string) => {
    const updatedList = [...nameList];
    updatedList[index] = newName.trim();
    setNameList(updatedList);
    saveNameList();
  };

  const handleGenerateName = () => {
    if (nameList.length > 0) {
      setIsSpinning(true);
      const spinDuration = 5000; // 5 seconds
      const spinRevolutions = 5 + Math.random() * 5; // 5 to 10 full rotations
      const randomIndex = Math.floor(Math.random() * nameList.length);
      const targetAngle = randomIndex / nameList.length * 360 + spinRevolutions * 360;

      setTimeout(() => {
        setGeneratedName(nameList[randomIndex]);
        setIsSpinning(false);
      }, spinDuration);

      return targetAngle;
    }
    return 0;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddName();
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
          onKeyDown={handleKeyDown}
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
                placeholder="Edit name"
                title={`Edit name ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveName(index)}
                className="name-remove-button"
                title={`Remove name ${index + 1}`}
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
        disabled={nameList.length === 0 || isSpinning}
        title="Generate a random name from the list"
      >
        Generate Random Name
      </button>
      {nameList.length > 0 && (
        <NameWheel
          names={nameList}
          isSpinning={isSpinning}
          onSpin={handleGenerateName}
        />
      )}
      {generatedName && !isSpinning && (
        <div>
          <h3>Generated Name:</h3>
          <p>{generatedName}</p>
        </div>
      )}
    </div>
  );
};

export default NameGenerator;
