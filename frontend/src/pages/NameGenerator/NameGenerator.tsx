import React, { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import NameWheel from "../../components/NameWheel";
import WheelSegment from "../../components/WheelSegment";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsNameGenerator } from "./tourStepsNameGenerator";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";

const NameGenerator: React.FC = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [nameListId, setNameListId] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showRightSide, setShowRightSide] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [spinData, setSpinData] = useState<{
    targetDegrees: number;
    spinRevolutions: number;
  } | null>(null);

  // Initialize visibilityStates with all properties
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isNameInputVisible: true,
    isAddNameButtonVisible: true,
    isSpinButtonVisible: true,
    isNamesListVisible: true,
    isDotCountTypeVisible: false,
    isMinDotsVisible: false,
    isMaxDotsVisible: false,
    isTypeSelectVisible: false,
    isItemCountVisible: false,
    isCollectionItemCountVisible: false,
    isDotColorVisible: false,
    isDotShapeVisible: false,
    isGenerateRandomSequenceButtonVisible: false,
    isFileUploadVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
    isSessionSettingsModalVisible: false,
    isEditCollectionModalVisible: false,
    isDuplicateCollectionModalVisible: false,
    isCollectionPreviewModalVisible: false,
    isNextButtonVisible: false,
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps = tourStepsNameGenerator(visibilityStates); // Create tour steps based on visibility states

  // Add a function to start the tour
  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  // Start the tour when the component mounts
  useEffect(() => {
    startTour(); // Call the startTour function
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://race-the-clock-backend-production.up.railway.app";

  const loadNameList = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${API_URL}/namelists/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Name list loaded successfully");
      if (response.data.length > 0) {
        const latestNameList = response.data[0];
        setNameListId(latestNameList.namelist_id);
        setNameList(latestNameList.names);
      } else {
        console.warn("No name lists found.");
      }
    } catch (error) {
      console.error("Error loading name list:", error);
    }
  }, [getAccessTokenSilently, API_URL]); // Added API_URL to the dependency array

  useEffect(() => {
    loadNameList();
  }, [loadNameList]);

  const saveNameList = async (updatedList: string[] = nameList) => {
    try {
      console.log("Saving name list...");
      const token = await getAccessTokenSilently();
      const data = { name: "My Name List", names: updatedList };

      if (nameListId) {
        console.log("Updating existing list");
        await axios.put(`${API_URL}/namelists/${nameListId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("List updated successfully");
      } else {
        console.log("Creating new list");
        const response = await axios.post(`${API_URL}/namelists/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("List created successfully");
        // We need this response to get the new nameListId
        setNameListId(response.data.namelist_id);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("API Error:", error.message);
      } else {
        console.error("Error saving name list", error);
      }
    }
  };

  const handleAddName = () => {
    if (nameInput.trim() !== "") {
      const updatedList = [...nameList, nameInput.trim()];
      setNameList(updatedList);
      setNameInput("");
      saveNameList(updatedList);

      // Update visibility states if needed
      setVisibilityStates((prev) => ({
        ...prev,
        isNamesListVisible: true, // Show names list after adding a name
      }));
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
    if (nameList.length > 0 && !isSpinning) {
      setIsSpinning(true);
      const spinRevolutions = 5 + Math.random() * 3; // Increased from 2-5 to 5-8 full rotations
      const degreesPerSlice = 360 / nameList.length;
      const selectedIndex = Math.floor(Math.random() * nameList.length);
      const targetDegrees = selectedIndex * degreesPerSlice + degreesPerSlice / 2;
      const totalDegrees = spinRevolutions * 360 + targetDegrees;

      console.log("--- Spin Initialization ---");
      console.log("Degrees Per Slice:", degreesPerSlice);
      console.log("Random Selected Index:", selectedIndex);
      console.log("Target Degrees:", targetDegrees);
      console.log("Total Degrees:", totalDegrees);
      console.log("Spin Revolutions:", spinRevolutions);

      setSpinData({ targetDegrees: totalDegrees, spinRevolutions });
    }
  };

  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleNameSelected = (name: string) => {
    console.log("Name selected");
    setIsSpinning(false);
    setSelectedName(name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddName();
    }
  };

  const handleToggleRightSide = () => {
    setShowRightSide(!showRightSide);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowRightSide(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="page-container" style={{ marginTop: "20px" }}>
      <div
        ref={containerRef}
        className={`name-generator ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
        }`}
        style={{
          backgroundColor:
            theme.backgroundImage === "none"
              ? theme.backgroundColor
              : "transparent",
          color: theme.displayTextColor || theme.textColor,
          backgroundImage:
            theme.backgroundImage !== "none"
              ? `url(${theme.backgroundImage})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className={`flex w-full max-w-5xl justify-between px-2 ${showRightSide ? "" : "justify-center"}`}
        >
          {/* Left side (centered when right side is hidden) */}
          <div
            className={`flex flex-col items-center ${showRightSide ? "w-1/2" : "w-full"}`}
          >
            <div className="relative flex w-full max-w-[500px] flex-col items-center">
              <NameWheel
                names={nameList}
                isSpinning={isSpinning}
                spinData={spinData}
                onNameSelected={handleNameSelected}
                stopSpinning={() => {
                  setIsSpinning(false);
                  setSpinData(null);
                }}
              />

              {visibilityStates.isSpinButtonVisible && (
                <button
                  type="button"
                  onClick={handleSpin}
                  className="spin-button bg-light-blue hover:bg-hover-blue active:bg-active-blue max-w-md rounded border border-black px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
                >
                  Spin the Wheel
                </button>
              )}
            </div>

            {/* Move selected name display here, below the spin button */}
            {selectedName && (
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold">Selected:</h2>
                <p className="text-xl">{selectedName}</p>
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
            {visibilityStates.isNameInputVisible && (
              <div className="mb-5 flex w-full flex-col items-center">
                <div className="flex items-center">
                  <label htmlFor="nameInput" className="mr-2 whitespace-nowrap">
                    Add a Name:
                  </label>
                  <input
                    type="text"
                    id="nameInput"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`font-teacher mr-2 rounded border border-black ${theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"} p-2 text-center text-base`}
                    placeholder="Enter a name"
                  />
                  {visibilityStates.isAddNameButtonVisible && (
                    <button
                      type="button"
                      onClick={handleAddName}
                      className="add-name-button bg-light-blue hover:bg-hover-blue active:bg-active-blue rounded border border-black px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            )}

            {visibilityStates.isNamesListVisible && (
              <div className="flex w-full flex-col items-center">
                <h2 className="mb-2 text-xl font-bold">Names on the Wheel:</h2>
                <ul className="list-none p-0 text-center">
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
            )}
          </div>
        </div>

        {/* Toggle button (always visible) */}
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-black bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
          onClick={handleToggleRightSide}
          style={{
            position: "absolute",
            top: "calc(210px + 56px + 1rem)", // Navbar (200px) + CollectionsNavBar (56px) + spacing
            right: "1rem",
            zIndex: 40, // Below the navbars (which are 50 and 51)
          }}
        >
          {showRightSide ? "-" : "+"}
        </button>

        {/* Add the GuidedTour component here */}
        <GuidedTour
          steps={steps}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={handleTourStepChange}
          tourName="nameGenerator"
        />
      </div>
    </div>
  );
};

export default NameGenerator;
