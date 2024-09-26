import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./NameGenerator.css";
import "../../App.css";
import NameWheel from "./NameWheel";
import WheelSegment from "./WheelSegment";

const NameGenerator: React.FC = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [nameListId, setNameListId] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

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
    saveNameList(updatedList);
  };

  const handleEditName = (index: number, newName: string) => {
    const updatedList = [...nameList];
    updatedList[index] = newName.trim();
    setNameList(updatedList);
    saveNameList(updatedList);
  };

  const handleGenerateName = () => {
    if (nameList.length > 0) {
      // The NameWheel component will handle the actual spinning and rotation logic.
      setIsSpinning(true);
      const spinRevolutions = 2 + Math.random() * 3; // 2 to 5 full rotations
      const targetAngle = spinRevolutions * 2 * Math.PI;
      return targetAngle;
    }
    return 0;
  };

  const handleNameSelected = (name: string) => {
    setGeneratedName(name);
    setIsSpinning(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddName();
    }
  };

  return (
    <div className="name-generator-container">
      <h1 className="name-generator-title">Name Generator</h1>
      <div className="name-generator-layout">
        <div className="name-wheel-container">
          {nameList.length > 0 && (
            <NameWheel
              names={nameList}
              isSpinning={isSpinning}
              onSpin={handleGenerateName}
              onNameSelected={handleNameSelected}
              stopSpinning={() => setIsSpinning(false)}
            />
          )}
          <button
            type="button"
            onClick={handleGenerateName}
            className="gen-styled-button"
            disabled={nameList.length === 0 || isSpinning}
            title="Generate a random name from the list"
          >
            Generate Random Name
          </button>
          {generatedName && !isSpinning && (
            <div className="generated-name">
              <h3>Generated Name:</h3>
              <p>{generatedName}</p>
            </div>
          )}
        </div>
        <div className="name-controls">
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
          <h3>Name List:</h3>
          <ul>
            {nameList.map((name, index) => (
              <WheelSegment
                key={index}
                name={name}
                index={index}
                onRemove={() => handleRemoveName(index)}
                onEdit={(newName) => handleEditName(index, newName)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;
