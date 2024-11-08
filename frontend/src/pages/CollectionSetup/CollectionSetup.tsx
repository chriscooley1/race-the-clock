import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  generateFullAlphabet,
  generateNumbersOneToHundred,
  generateMathProblems,
  generateNumberSenseImages,
  generatePeriodicTableElements,
  generateScienceTerms,
  generateNursingTerms,
  generateFullPeriodicTable,
  generateRandomLowercaseLetters,
  generateRandomMixedCaseLetters,
} from "../../utils/RandomGenerators";
import { saveCollection, getCurrentUser } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../../types/user";
import { useTheme } from "../../context/ThemeContext";
import { VisibilityStates } from "../../types/VisibilityStates";
import { tourStepsCollectionSetup } from "./tourStepsCollectionSetup";
import { Step } from "react-joyride";
import GuidedTour from "../../components/GuidedTour";

type Operation =
  | "multiplication"
  | "addition"
  | "subtraction"
  | "division"
  | "PeriodicElement";

const CollectionSetup: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category } = location.state || {};
  const { theme } = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const [collectionItemCount, setCollectionItemCount] = useState<number>(1);
  const [sequence, setSequence] = useState<
    Array<{ name: string; svg?: string; count?: number }>
  >([]);
  const [type, setType] = useState<string>("letters");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [numberSenseItems, setNumberSenseItems] = useState<
    { url?: string; svg?: string; count: number }[]
  >([]);
  const [dotColor, setDotColor] = useState<string>("blue");
  const [dotShape, setDotShape] = useState<string>("circle");
  const [dotCountType, setDotCountType] = useState<"fixed" | "random">("fixed");
  const [minDots, setMinDots] = useState<number>(1);
  const [maxDots, setMaxDots] = useState<number>(10);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [previewSequence, setPreviewSequence] = useState<
    Array<{ name: string; svg?: string; count?: number }>
  >([]);
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isDotCountTypeVisible: true,
    isMinDotsVisible: true,
    isMaxDotsVisible: true,
    isTypeSelectVisible: true,
    isItemCountVisible: true,
    isCollectionItemCountVisible: true,
    isDotColorVisible: true,
    isDotShapeVisible: true,
    isGenerateRandomSequenceButtonVisible: true,
    isSubmitButtonVisible: true,
    isFileUploadVisible: true,
    isClearButtonVisible: true,
    isGeneratedSequencePreviewVisible: false,
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
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
    isSessionSettingsModalVisible: false,
    isEditCollectionModalVisible: false,
    isDuplicateCollectionModalVisible: false,
    isCollectionPreviewModalVisible: false,
  });
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps: Step[] = tourStepsCollectionSetup(visibilityStates);

  // Example of updating visibility states based on some condition
  useEffect(() => {
    // Update visibility states based on your logic
    setVisibilityStates((prev) => ({
      ...prev,
      isGeneratedSequencePreviewVisible: true,
    }));
  }, []);

  // Call createTourSteps with updated visibilityStates
  useEffect(() => {
    console.log("Generated tour steps:", steps); // Debugging log for steps
    if (isTourRunning) {
      console.log("Tour is running with steps:", steps);
    }
  }, [visibilityStates, isTourRunning]); // Regenerate steps when visibility states change

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        if (isUser(fetchedUser)) {
          const userWithDefaults: User = {
            ...fetchedUser,
            id: fetchedUser.id || generateId(),
            name: fetchedUser.name || "Default Name",
            username: fetchedUser.username || "defaultUsername",
            email: fetchedUser.email || "default@example.com",
          };
          setCurrentUser(userWithDefaults);
        } else {
          console.error(
            "Fetched user is missing required properties:",
            fetchedUser,
          );
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);

  // Set type based on category
  useEffect(() => {
    switch (category) {
      case "Math":
        setType("numbers");
        break;
      case "Language Arts":
        setType("letters");
        break;
      case "Number Sense":
        setType("numberSense");
        break;
      case "Science":
        setType("scienceTerms");
        break;
      case "Nursing":
        setType("nursingTerms");
        break;
      default:
        setType("letters");
    }
    console.log("Current type set to:", type); // Debugging log for type
  }, [category]);

  // Set default operation for math problems
  useEffect(() => {
    if (type === "mathProblems" && !operation) {
      setOperation("addition"); // Set a default operation
    }
  }, [type, operation]);

  // Start the tour based on a specific condition
  useEffect(() => {
    // Check if the tour has been completed before
    const tourCompleted = localStorage.getItem("tourCompleted");

    // Start the tour if it hasn't been completed
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  // Update visibility states based on the selected type
  useEffect(() => {
    const newVisibilityStates: VisibilityStates = {
      ...visibilityStates, // Spread existing visibility states
      isDotCountTypeVisible: type === "numberSense",
      isMinDotsVisible: dotCountType === "random",
      isMaxDotsVisible: dotCountType === "random",
      isTypeSelectVisible: true,
      isItemCountVisible: true,
      isCollectionItemCountVisible: true,
      isDotColorVisible: true,
      isDotShapeVisible: true,
      isGenerateRandomSequenceButtonVisible: true,
      isFileUploadVisible: true,
      isClearButtonVisible: true,
      isSubmitButtonVisible: true,
      isGeneratedSequencePreviewVisible: isGenerated,
      isNameInputVisible: false,
      isAddNameButtonVisible: false,
      isSpinButtonVisible: false,
      isNamesListVisible: false,
      isCollectionNameVisible: false,
      isCategorySelectVisible: false,
      isStageSelectVisible: false,
      isPublicCheckboxVisible: false,
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
      isSessionSettingsModalVisible: false,
      isEditCollectionModalVisible: false,
      isDuplicateCollectionModalVisible: false,
    };
    setVisibilityStates(newVisibilityStates);
  }, [type, dotCountType, isGenerated]); // Add dependencies as needed

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = {
          name: selectedFile.name,
          svg: reader.result as string,
          count: 1,
        };
        setSequence([newItem]);
        setPreviewSequence([newItem]);
        setIsGenerated(true);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const generateRandomSequence = () => {
    // Determine the maximum quantity based on the type
    let maxQuantity = 0;

    switch (type) {
      case "randomLowercase":
      case "randomMixedCase":
        maxQuantity = 52; // 26 lowercase + 26 uppercase
        break;
      case "letters":
        maxQuantity = 26; // Uppercase letters
        break;
      case "numbers":
        maxQuantity = 100; // Numbers from 1 to 100
        break;
      // Add other cases as needed
      default:
        maxQuantity = itemCount; // Default to current itemCount if type is not recognized
    }

    // Adjust itemCount if it exceeds maxQuantity
    if (itemCount > maxQuantity) {
      setItemCount(maxQuantity); // Set itemCount to maxQuantity
    }

    let generatedSequence: Array<{
      name: string;
      svg?: string;
      count?: number;
    }> = [];

    // Clear previous number sense items
    setNumberSenseItems([]);

    const usedItems = new Set<string>(); // Track used items to avoid duplicates

    // Generate the sequence based on the type
    switch (type) {
      case "numbers":
        while (generatedSequence.length < itemCount) {
          const num = Math.floor(Math.random() * 100) + 1; // Random numbers from 1 to 100
          if (!usedItems.has(num.toString())) {
            generatedSequence.push({ name: num.toString() });
            usedItems.add(num.toString());
          }
        }
        break;
      case "letters":
        while (generatedSequence.length < itemCount) {
          const letter = String.fromCharCode(
            Math.floor(Math.random() * 26) + 65,
          ); // Random uppercase letters
          if (!usedItems.has(letter)) {
            generatedSequence.push({ name: letter });
            usedItems.add(letter);
          }
        }
        break;
      case "randomLowercase": // New case for random lowercase letters
        while (generatedSequence.length < itemCount) {
          const letter = generateRandomLowercaseLetters(1)[0]; // Generate one random lowercase letter
          if (!usedItems.has(letter)) {
            generatedSequence.push({ name: letter });
            usedItems.add(letter);
          }
        }
        break;
      case "randomMixedCase": // New case for random mixed case letters
        while (generatedSequence.length < itemCount) {
          const letter = generateRandomMixedCaseLetters(1)[0]; // Generate one random mixed case letter
          if (!usedItems.has(letter)) {
            generatedSequence.push({ name: letter });
            usedItems.add(letter);
          }
        }
        break;
      case "alphabet":
        generatedSequence = generateFullAlphabet().map((letter) => ({
          name: letter,
        }));
        break;
      case "numbersOneToHundred":
        generatedSequence = generateNumbersOneToHundred().map((num) => ({
          name: num.toString(),
        }));
        break;
      case "mathProblems":
        if (operation && operation !== "PeriodicElement") {
          generatedSequence = generateMathProblems(itemCount, operation).map(
            (problem) => ({ name: problem }),
          );
        } else {
          console.error(
            "Math Problems selected but operation is not set or is PeriodicElement",
          );
        }
        break;
      case "numberSense": {
        const generatedItems = [];
        for (let i = 0; i < collectionItemCount; i++) {
          let dotCount;
          if (dotCountType === "fixed") {
            dotCount = itemCount;
          } else {
            dotCount =
              Math.floor(Math.random() * (maxDots - minDots + 1)) + minDots;
          }
          const image = generateNumberSenseImages(dotCount, dotColor, dotShape);
          generatedItems.push({
            name: `Number Sense Image (Count: ${image.count})`,
            svg: image.svg,
            count: image.count,
          });
        }
        setNumberSenseItems(generatedItems);
        generatedSequence = generatedItems;
        break;
      }
      case "periodicTable":
        generatedSequence = generatePeriodicTableElements(itemCount).map(
          (element) => ({ name: element }),
        );
        break;
      case "scienceTerms":
        generatedSequence = generateScienceTerms(itemCount).map((term) => ({
          name: term,
        }));
        break;
      case "nursingTerms":
        generatedSequence = generateNursingTerms(itemCount).map((term) => ({
          name: term,
        }));
        break;
      case "fullPeriodicTable":
        generatedSequence = generateFullPeriodicTable().map((element) => ({
          name: element,
        }));
        break;
      default:
        console.error("Invalid type selected");
    }
    console.log("Generated sequence:", generatedSequence); // Debugging log for generated sequence
    setSequence(generatedSequence);
    setPreviewSequence(generatedSequence);
    setFile(null);
    setIsGenerated(true);
  };

  const handleNext = () => {
    if (!collectionName) {
      alert("Collection name is missing. Please go back and enter a name.");
      return;
    }

    // Check if a random sequence was generated or a file was uploaded
    if (isGenerated || file) {
      handleSaveCollection(); // Call the save function directly
    } else {
      // Navigate to CollectionFinalStep if no sequence or file
      navigate("/collection-final-step", {
        state: { collectionName, isPublic, category, sequence, type },
      });
    }
  };

  const handleClear = () => {
    setIsGenerated(false);
    setSequence([]);
    setPreviewSequence([]);
    setFile(null);
    setNumberSenseItems([]);
  };

  const handleSaveCollection = async () => {
    console.log("User data before saving collection:", currentUser); // Debugging log for user data

    try {
      if (!currentUser || !currentUser.username) {
        throw new Error("Current user is undefined");
      }

      // Use previewSequence instead of sequence
      const collectionData = previewSequence.map((item, index) => ({
        id: index + 1,
        name: item.name,
        svg: item.svg,
        count: item.count,
        file: file ? file.name : null,
      }));

      console.log("Saving collection with data:", {
        username: currentUser.username,
        collectionName,
        collectionData,
        isPublic,
        category,
        type,
      });
      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        type,
        getAccessTokenSilently,
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
      alert("There was an error saving your collection. Please try again.");
    }
  };

  const shouldHideQuantity = (selectedType: string): boolean => {
    return ["numbersOneToHundred", "alphabet", "fullPeriodicTable"].includes(
      selectedType,
    );
  };

  // Function to edit an item in the preview sequence
  const editItem = (index: number, newName: string) => {
    const updatedSequence = [...previewSequence];
    updatedSequence[index].name = newName; // Update the name
    setPreviewSequence(updatedSequence); // Set the updated sequence
  };

  // Function to delete an item from the preview sequence
  const deleteItem = (index: number) => {
    const updatedSequence = previewSequence.filter((_, i) => i !== index);
    setPreviewSequence(updatedSequence); // Set the updated sequence
  };

  if (!currentUser) {
    return <div className="p-4 text-center">Loading user information...</div>;
  }

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[60px] ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <h1 className="collection-setup text-4xl font-bold">Step 2 - Setup</h1>
      <h2 className="text-3xl font-bold">Collection: {collectionName}</h2>
      <h3 className="mb-4 text-2xl font-semibold">Category: {category}</h3>
      <div className="mb-4 flex w-full max-w-3xl flex-col items-center space-y-4">
        {category !== "Number Sense" ? (
          <>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="typeSelect"
                className="whitespace-nowrap font-bold"
              >
                Type:
              </label>
              <select
                id="typeSelect"
                className="font-caveat rounded border border-gray-300 bg-white p-2 text-center text-black"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  console.log("Type changed to:", e.target.value); // Debugging log for type change
                }}
              >
                {category === "Math" && (
                  <>
                    <option value="numbers">Numbers</option>
                    <option value="numbersOneToHundred">Numbers 1-100</option>
                    <option value="mathProblems">Math Problems</option>
                  </>
                )}
                {category === "Language Arts" && (
                  <>
                    <option value="letters">Uppercase Letters</option>
                    <option value="randomLowercase">Lowercase Letters</option>
                    <option value="randomMixedCase">Mixed Case Letters</option>
                    <option value="alphabet">Full Alphabet</option>
                  </>
                )}
                {category === "Science" && (
                  <>
                    <option value="periodicTable">Periodic Table</option>
                    <option value="fullPeriodicTable">
                      Full Periodic Table
                    </option>
                    <option value="scienceTerms">Science Terms</option>
                  </>
                )}
                {category === "Nursing" && (
                  <option value="nursingTerms">Nursing Terms</option>
                )}
              </select>
            </div>
            {!shouldHideQuantity(type) && (
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="itemCount"
                  className="whitespace-nowrap font-bold"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="itemCount"
                  className="rounded-md border border-gray-300 p-2 text-center font-['Caveat']"
                  value={itemCount}
                  min={1}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10);
                    setItemCount(count);
                    console.log("Item count changed to:", count); // Debugging log for item count change
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="dotCountType"
                className="whitespace-nowrap font-bold"
              >
                Dot Count Type:
              </label>
              <select
                id="dotCountType"
                className="rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
                value={dotCountType}
                onChange={(e) => {
                  setDotCountType(e.target.value as "fixed" | "random");
                  console.log("Dot count type changed to:", e.target.value); // Debugging log for dot count type change
                }}
              >
                <option value="fixed">Fixed</option>
                <option value="random">Random</option>
              </select>
            </div>
            {dotCountType === "fixed" ? (
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="itemCount"
                  className="whitespace-nowrap font-bold"
                >
                  Number of Dots:
                </label>
                <input
                  type="number"
                  id="itemCount"
                  className="rounded-md border border-gray-300 p-2 text-center font-['Caveat']"
                  value={itemCount}
                  min={1}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10);
                    setItemCount(count);
                    console.log("Item count changed to:", count); // Debugging log for item count change
                  }}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="minDots"
                    className="whitespace-nowrap font-bold"
                  >
                    Minimum Dots:
                  </label>
                  <input
                    type="number"
                    id="minDots"
                    className="rounded-md border border-gray-300 p-2 text-center font-['Caveat']"
                    value={minDots}
                    min={1}
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10);
                      setMinDots(count);
                      console.log("Minimum dots changed to:", count); // Debugging log for min dots change
                    }}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="maxDots"
                    className="whitespace-nowrap font-bold"
                  >
                    Maximum Dots:
                  </label>
                  <input
                    type="number"
                    id="maxDots"
                    className="rounded-md border border-gray-300 p-2 text-center font-['Caveat']"
                    value={maxDots}
                    min={minDots}
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10);
                      setMaxDots(count);
                      console.log("Maximum dots changed to:", count); // Debugging log for max dots change
                    }}
                  />
                </div>
              </>
            )}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="collectionItemCount"
                className="whitespace-nowrap font-bold"
              >
                Number of Items in Collection:
              </label>
              <input
                type="number"
                id="collectionItemCount"
                className="rounded-md border border-gray-300 p-2 text-center font-['Caveat']"
                value={collectionItemCount}
                min={1}
                onChange={(e) => {
                  const count = parseInt(e.target.value, 10);
                  setCollectionItemCount(count);
                  console.log("Collection item count changed to:", count); // Debugging log for collection item count change
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="dot-color"
                className="whitespace-nowrap font-bold"
              >
                Dot Color:
              </label>
              <select
                id="dot-color"
                className="rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
                value={dotColor}
                onChange={(e) => {
                  setDotColor(e.target.value);
                  console.log("Dot color changed to:", e.target.value); // Debugging log for dot color change
                }}
              >
                {["blue", "green", "red", "purple", "orange"].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="dot-shape"
                className="whitespace-nowrap font-bold"
              >
                Dot Shape:
              </label>
              <select
                id="dot-shape"
                className="rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
                value={dotShape}
                onChange={(e) => {
                  setDotShape(e.target.value);
                  console.log("Dot shape changed to:", e.target.value); // Debugging log for dot shape change
                }}
              >
                {["circle", "square", "triangle"].map((shape) => (
                  <option key={shape} value={shape}>
                    {shape}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button
          type="button"
          className="generate-random-sequence-button rounded-md bg-green-500 px-4 py-2 font-bold uppercase text-white transition duration-300 hover:bg-green-600"
          onClick={generateRandomSequence}
        >
          Generate Random Sequence
        </button>
        <p className="text-center">- OR -</p>
        <div>
          <label htmlFor="fileUpload" className="mb-2 block font-bold">
            {/* Choose File: */}
          </label>
          <input
            type="file"
            id="fileUpload"
            className="w-full rounded-md border border-gray-300 p-2 font-['Caveat']"
            onChange={handleFileChange}
          />
        </div>
        {isGenerated ? (
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              className="bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-gray-300 p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={handleNext}
            >
              Save Collection
            </button>
            <button
              type="button"
              className="clear-button mt-2 rounded-md bg-yellow-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-yellow-600"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="next-button bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-gray-300 p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
      {isGenerated && category !== "Number Sense" && (
        <div className="mt-6">
          <h3 className="generated-sequence-preview mb-2 text-center text-xl font-bold">
            Generated Sequence Preview:
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {previewSequence.map((item, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-300 p-2"
              >
                <p className="text-center">{item.name}</p>
                {item.svg && (
                  <img
                    src={item.svg}
                    alt={item.name}
                    className="h-auto w-full"
                  />
                )}
                <div className="mt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      editItem(
                        index,
                        prompt("Edit item name:", item.name) || item.name,
                      )
                    }
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {category === "Number Sense" && numberSenseItems.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-center text-xl font-bold">
            Generated Sequence:
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {numberSenseItems.map((image, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-300 p-2"
              >
                <img
                  src={image.url || image.svg}
                  alt={`Number Sense Image ${index + 1}`}
                  className="h-auto w-full"
                />
                <p className="mt-2 text-center">Count: {image.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="collectionSetup"
      />
    </div>
  );
};

export default CollectionSetup;
// Define the type guard function
function isUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    typeof (user as User).username === "string"
  );
}

// Define the function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
