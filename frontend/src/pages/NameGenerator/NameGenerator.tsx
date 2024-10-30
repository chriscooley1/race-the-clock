import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
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
  const [generatedName, setGeneratedName] = useState<string | null>(null);
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
    isNextButtonVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isBadgesSectionVisible: false,
    isAchievementsSectionVisible: false,
    isLoadingMessageVisible: false,
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isPreviousButtonVisible: false,
    isProgressIndicatorVisible: false,
    isPauseButtonVisible: false,
    isScreenClickAreaVisible: false,
    isMatchingGameVisible: false,
    isMultipleWordsGameVisible: false,
    isRegisterButtonVisible: false,
    isLoginButtonVisible: false,
    isProfileVisible: false,
    isUpdateFormVisible: false,
    isNameInputVisible: true,
    isAddNameButtonVisible: true,
    isSpinButtonVisible: true,
    isNamesListVisible: true,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isReportsOverviewVisible: false,
    isReportsListVisible: false,
    isFAQSectionVisible: false,
    isInstructionalVideosVisible: false,
    isTimedChallengesVisible: false,
    isCollectionsOverviewVisible: false,
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
    isMainFontVisible: false,
    isHeadingFontVisible: false,
    isButtonFontVisible: false,
    isColorThemeVisible: false,
    isTextColorVisible: false,
    isBackgroundColorVisible: false,
    isAccessibilityVisible: false,
    isBackgroundThemeVisible: false,
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

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; // Fallback to localhost for development

  console.log("API_URL:", API_URL); // Add this line to check the value
  console.log("Environment Variables:", import.meta.env);

  const loadNameList = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${API_URL}/namelists/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data);
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
      console.log("Saving name list:", updatedList);
      const token = await getAccessTokenSilently();
      const data = { name: "My Name List", names: updatedList };
      if (nameListId) {
        console.log("Updating existing list with ID:", nameListId);
        const response = await axios.put(
          `${API_URL}/namelists/${nameListId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("Update response:", response.data);
      } else {
        console.log("Creating new list");
        const response = await axios.post(`${API_URL}/namelists/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Create response:", response.data);
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
      const spinRevolutions = 2 + Math.random() * 3; // 2 to 5 full rotations
      const degreesPerSlice = 360 / nameList.length; // Calculate degrees per slice
      const selectedIndex = Math.floor(Math.random() * nameList.length); // Randomly select an index
      const centerAngle = (selectedIndex + 0.5) * degreesPerSlice; // Center angle for the selected name
      const targetDegrees = (spinRevolutions * 360 + centerAngle - 90) % 360; // Adjust to stop at the top
      console.log(
        `spinRev: ${spinRevolutions} targetDegrees: ${targetDegrees}`,
      );
      setSpinData({ targetDegrees, spinRevolutions });
    }
  };

  const handleNameSelected = (name: string) => {
    console.log(`nameSelected: ${name}`);
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
    <div
      ref={containerRef}
      className={`name-generator flex min-h-screen flex-col items-center justify-center pl-[250px] pt-[100px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <div
        className={`flex w-full max-w-5xl justify-between px-2 ${showRightSide ? "" : "justify-center"}`}
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
              spinData={spinData}
              onNameSelected={handleNameSelected}
              stopSpinning={() => {
                setIsSpinning(false);
                setSpinData(null);
              }}
            />
          </div>
          {visibilityStates.isSpinButtonVisible && (
            <button
              type="button"
              onClick={handleSpin}
              className="spin-button bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-4 max-w-md rounded px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
            >
              Spin the Wheel
            </button>
          )}
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
          {visibilityStates.isNameInputVisible && (
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
                className="font-caveat mr-2 rounded border border-current bg-white p-2 text-center text-base text-black"
                placeholder="Enter a name"
              />
              {visibilityStates.isAddNameButtonVisible && (
                <button
                  type="button"
                  onClick={handleAddName}
                  className="add-name-button bg-light-blue hover:bg-hover-blue active:bg-active-blue rounded px-4 py-2 font-bold uppercase text-black transition duration-300 hover:scale-105 active:scale-95"
                >
                  Add
                </button>
              )}
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
        className="bg-light-blue hover:bg-hover-blue active:bg-active-blue fixed right-4 top-[70px] rounded-full p-4 font-bold text-black transition duration-300 hover:scale-105 active:scale-95"
        onClick={handleToggleRightSide}
      >
        {showRightSide ? "-" : "+"}
      </button>

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange} // Pass the step change handler
        tourName="nameGenerator"
      />
    </div>
  );
};

export default NameGenerator;
