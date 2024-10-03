import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import NameWheel from "./NameWheel";
import WheelSegment from "./WheelSegment";
import { useTheme } from "../context/ThemeContext";

const NameGenerator: React.FC = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [nameListId, setNameListId] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showRightSide, setShowRightSide] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const loadNameList = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("http://localhost:8000/namelists/", {
        headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const response = await axios.post(
          "http://localhost:8000/namelists/",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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

  const handleSpin = () => {
    if (nameList.length > 0) {
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

  const handleToggleRightSide = () => {
    setShowRightSide(!showRightSide);
  };

  return (
    <div
      ref={containerRef}
      className={`flex min-h-screen flex-col items-center pl-[250px] pt-[50px] ${theme.isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      <div
        className={`flex w-full max-w-5xl justify-between px-4 ${showRightSide ? "" : "justify-center"}`}
      >
        {/* Left side (centered when right side is hidden) */}
        <div
          className={`flex flex-col items-center ${showRightSide ? "w-1/2" : "w-full"}`}
        >
          <div className="relative w-full max-w-[500px]">
            <div className="absolute left-1/2 top-0 z-10 size-0 -translate-x-1/2 border-x-[20px] border-t-[40px] border-x-transparent border-t-red-500"></div>
            <NameWheel
              names={nameList}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              onNameSelected={handleNameSelected}
              stopSpinning={() => setIsSpinning(false)}
            />
          </div>
          <button
            type="button"
            onClick={handleSpin}
            className="bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-4 max-w-md rounded px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
          >
            Spin the Wheel
          </button>
          {generatedName && (
            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold">Generated Name:</h2>
              <p className="text-2xl">{generatedName}</p>
            </div>
          )}
        </div>

        {/* Right side (hidden by default, shown when triggered) */}
        <div
          className={`ml-8 flex flex-col transition-all duration-300 ${
            showRightSide
              ? "w-1/2 opacity-100"
              : "w-0 overflow-hidden opacity-0"
          }`}
        >
          <div className="mb-5 flex items-center">
            <label htmlFor="nameInput" className="mr-2 whitespace-nowrap">
              Add a Name:
            </label>
            <input
              type="text"
              id="nameInput"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-caveat mr-2 grow rounded border border-current bg-white p-2 text-base text-black"
              placeholder="Enter a name"
            />
            <button
              type="button"
              onClick={handleAddName}
              className="bg-light-blue hover:bg-hover-blue active:bg-active-blue rounded px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </div>
          <div className="w-full">
            <h2 className="mb-2 text-xl font-bold">Names on the Wheel:</h2>
            <ul className="list-none p-0">
              {nameList.map((name, index) => (
                <WheelSegment
                  key={index}
                  name={name}
                  index={index}
                  angle={0}
                  radius={150}
                  onRemove={() => handleRemoveName(index)}
                  onEdit={(newName) => handleEditName(index, newName)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Toggle button (always visible) */}
      <button
        type="button"
        className="bg-light-blue hover:bg-hover-blue active:bg-active-blue fixed right-4 top-[70px] rounded-full p-4 font-bold text-black transition duration-300 hover:scale-105 active:scale-95"
        onClick={handleToggleRightSide}
      >
        {showRightSide ? "-" : "+"}
      </button>
    </div>
  );
};

export default NameGenerator;
