import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { saveCollection, getCurrentUser } from "../../api";
import { periodicTable, PeriodicElement } from "../../utils/periodicTable";
import { User } from "../../types/user";
import { useTheme } from "../../context/ThemeContext";
import {
  generateCountingSvg,
  generateScienceTerms,
  generateNursingTerms,
} from "../../utils/RandomGenerators";
import { v4 as uuidv4 } from "uuid";
import { tourStepsCollectionFinalStep } from "./tourStepsCollectionFinalStep";
import { VisibilityStates } from "../../types/VisibilityStates";
import GuidedTour from "../../components/GuidedTour";
import FeedbackForm from "../../components/FeedbackForm";
import FeedbackIcon from "../../components/FeedbackIcon";

// Export the function to avoid the "unused" error
// createTourSteps will be used in future implementation
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface LocationState {
  collectionName: string;
  isPublic: boolean;
  category: string;
  sequence: string[];
  type?: string;
}

interface ImageWithCount {
  id: string;
  file: File;
  preview: string;
  count: number;
}

const CollectionFinalStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    collectionName,
    isPublic,
    category,
    sequence,
    type: initialType,
  } = location.state as LocationState;
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<
    {
      id: number;
      name: string;
      svg?: string;
      count?: number;
      answer?: number;
    }[]
  >(sequence.map((name, index) => ({ id: index + 1, name })));
  const [newItem, setNewItem] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { theme } = useTheme();

  interface Dot {
    position: string;
    color: string;
    shape: string;
    count: number;
  }

  const [dots, setDots] = useState<Dot[]>([
    { position: "1", color: "blue", shape: "circle", count: 1 },
  ]);

  const [firstNumber, setFirstNumber] = useState<number>(1);
  const [operator, setOperator] = useState<string>("addition");
  const [secondNumber, setSecondNumber] = useState<number>(1);

  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [customTerm, setCustomTerm] = useState<string>("");
  const [terms, setTerms] = useState<string[]>([]);

  const [availablePositions, setAvailablePositions] = useState<number[]>(
    Array.from({ length: 25 }, (_, i) => i + 1),
  );

  // Add this new state
  const [selectedPositions, setSelectedPositions] = useState<number[]>([1]);

  const [images, setImages] = useState<ImageWithCount[]>([]);

  // Initialize visibilityStates with all properties
  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isSaveButtonVisible: true,
    isItemPreviewVisible: true,
    isMathProblemVisible: true,
    isDotButtonVisible: true,
    isImageUploadVisible: true,
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
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
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

  // Tour state management
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Update visibility states based on your logic
  useEffect(() => {
    setVisibilityStates((prev) => ({
      ...prev,
      isItemPreviewVisible: items.length > 0,
      isMathProblemVisible: true,
      isDotButtonVisible: true,
    }));
  }, [items]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        setCurrentUser(fetchedUser as User); // Add type assertion here
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (category === "Science") {
      setTerms(generateScienceTerms(20)); // Generate 20 science terms
    } else if (category === "Nursing") {
      setTerms(generateNursingTerms(20)); // Generate 20 nursing terms
    }
  }, [category]);

  const handleElementSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const element = JSON.parse(selectedValue) as PeriodicElement;
      setNewItem(
        `${element.symbol} - ${element.name} - ${element.atomicNumber}`,
      );
      setSelectedElement(selectedValue);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: newItem }]);
    setNewItem("");
    setSelectedElement("");
  };

  const handleAddDot = () => {
    const newPosition = availablePositions[0] || 1;
    setDots([
      ...dots,
      {
        position: newPosition.toString(),
        color: "blue",
        shape: "circle",
        count: 1,
      },
    ]);
    setSelectedPositions([...selectedPositions, newPosition]);
    setAvailablePositions((prev) => prev.filter((pos) => pos !== newPosition));
  };

  const handleRemoveDot = (index: number) => {
    const removedPosition = parseInt(dots[index].position);
    setDots(dots.filter((_, i) => i !== index));
    setSelectedPositions(selectedPositions.filter((_, i) => i !== index));
    setAvailablePositions((prev) =>
      [...prev, removedPosition].sort((a, b) => a - b),
    );
  };

  const handleDotChange = (
    index: number,
    field: keyof Dot,
    value: string | number,
  ) => {
    const newDots = [...dots];
    if (field === "position") {
      const oldPosition = parseInt(newDots[index].position);
      const newPosition = parseInt(value as string);

      // Update selectedPositions
      const newSelectedPositions = [...selectedPositions];
      newSelectedPositions[index] = newPosition;
      setSelectedPositions(newSelectedPositions);

      // Update availablePositions
      setAvailablePositions((prev) => {
        const updated = [...prev, oldPosition].filter(
          (pos) => !newSelectedPositions.includes(pos) && pos !== newPosition,
        );
        return updated.sort((a, b) => a - b);
      });

      // Update the position in the dots state
      newDots[index].position = newPosition.toString();
    } else if (field === "count") {
      newDots[index][field] = value as number;
    } else {
      newDots[index][field] = value as string;
    }
    setDots(newDots);
  };

  const combineSvgs = (svgs: string[]): string => {
    const svgWidth = 200;
    const svgHeight = 200;
    const decodedSvgs = svgs.map((svg) => {
      const decoded = decodeURIComponent(svg.split(",")[1]);
      // Extract just the inner content of each SVG
      const content = decoded.replace(/<\/?svg[^>]*>/g, "");
      return content;
    });

    const combinedSvgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <g>
          ${decodedSvgs.join("")}
        </g>
      </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(combinedSvgContent.trim())}`;
  };

  const handleAddNumberSenseItem = () => {
    const svgs = dots.map((dot) => {
      const svg = generateCountingSvg(
        dot.count,
        dot.color,
        dot.shape,
        dot.position,
      );
      console.log("SVG generated successfully");
      return svg;
    });

    const combinedSvg = combineSvgs(svgs);
    console.log("SVGs combined successfully");

    const newItem = {
      id: items.length + 1,
      name: `Number Sense: ${dots.reduce((sum, dot) => sum + dot.count, 0)} dot(s)`,
      svg: combinedSvg,
      count: dots.reduce((sum, dot) => sum + dot.count, 0),
    };
    console.log("Item added successfully");
    setItems([...items, newItem]);

    // Reset available positions after adding the item
    setAvailablePositions(Array.from({ length: 25 }, (_, i) => i + 1));
    setDots([{ position: "1", color: "blue", shape: "circle", count: 1 }]);
    setSelectedPositions([1]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSaveCollection = async () => {
    if (!currentUser) {
      console.error("User authentication required");
      return;
    }

    try {
      const collectionData = items.map((item) => ({
        name: item.name,
        svg: item.svg,
        count: item.count,
      }));

      console.log("Preparing to save collection");
      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        initialType || "custom", // Changed from type to initialType
        getAccessTokenSilently,
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection", error);
      alert("There was an error saving your collection. Please try again.");
    }
  };

  // Function to calculate the answer based on selected values
  const calculateAnswer = () => {
    let answer: number;
    switch (operator) {
      case "addition":
        answer = firstNumber + secondNumber;
        break;
      case "subtraction":
        answer = firstNumber - secondNumber;
        break;
      case "multiplication":
        answer = firstNumber * secondNumber;
        break;
      case "division":
        answer = firstNumber / secondNumber;
        break;
      default:
        answer = 0;
    }
    return answer;
  };

  const handleAddMathProblem = () => {
    const answer = calculateAnswer();
    let operatorSymbol;
    switch (operator) {
      case "addition":
        operatorSymbol = "+";
        break;
      case "subtraction":
        operatorSymbol = "-";
        break;
      case "multiplication":
        operatorSymbol = "×";
        break;
      case "division":
        operatorSymbol = "÷";
        break;
      default:
        operatorSymbol = "+";
    }
    const problemString = `${firstNumber} ${operatorSymbol} ${secondNumber}`;
    const newItem = `${problemString}|${answer}`;

    setItems([...items, { id: items.length + 1, name: newItem }]);
  };

  const handleTermSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(event.target.value);
    setCustomTerm("");
  };

  const handleCustomTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomTerm(event.target.value);
    setSelectedTerm("");
  };

  const handleAddTerm = () => {
    const termToAdd = selectedTerm || customTerm;
    if (termToAdd) {
      setItems([...items, { id: items.length + 1, name: termToAdd }]);
      setSelectedTerm("");
      setCustomTerm("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        count: 1, // Default count
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleImageCountChange = (imageId: string, newCount: number | null) => {
    setImages(prevImages =>
      prevImages.map(image =>
        image.id === imageId
          ? { 
              ...image, 
              count: newCount === null ? 0 : newCount // Allow null/empty values
            }
          : image
      )
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleAddImageItem = () => {
    const newItems = images.map((image) => ({
      id: items.length + 1,
      name: image.file.name,
      svg: image.preview,
      count: image.count, // Include the count in the item
    }));
    setItems([...items, ...newItems]);
    setImages([]);
  };

  // Generate tour steps based on visibility states
  const steps = tourStepsCollectionFinalStep(visibilityStates);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    // Additional logic for when the tour completes
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true); // Start the tour if not completed
    }
  }, []);

  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

  if (!currentUser) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="page-container">
      <div
        className={`flex min-h-screen w-full flex-col items-center pt-[20px] ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
        }`}
        style={{ color: theme.originalTextColor }}
      >
        <h1 className="collection-final-step text-4xl font-bold">
          Step 3 - Create Your Own Collection
        </h1>
        <h1 className="text-3xl font-bold">Collection: {collectionName}</h1>
        <p className="mb-4">
          To add another item to this Collection, click the add button below.
        </p>
        <div className="mb-4 flex flex-col items-center text-center">
          {category === "Math" && initialType === "mathProblems" ? (
            <>
              <label htmlFor="first-number-select">First Number:</label>
              <select
                id="first-number-select"
                value={firstNumber}
                onChange={(e) => setFirstNumber(Number(e.target.value))}
                className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <label htmlFor="operator-select">Operator:</label>
              <select
                id="operator-select"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
              >
                <option value="addition">+</option>
                <option value="subtraction">-</option>
                <option value="multiplication">×</option>
                <option value="division">÷</option>
              </select>
              <label htmlFor="second-number-select">Second Number:</label>
              <select
                id="second-number-select"
                value={secondNumber}
                onChange={(e) => setSecondNumber(Number(e.target.value))}
                className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddMathProblem}
                className="add-math-problem-button mb-4 rounded-md border border-black bg-blue-500 px-4 py-2 text-white"
              >
                Add Math Problem
              </button>
            </>
          ) : (
            <>
              {category === "Number Sense" ? (
                <>
                  {dots.map((dot, index) => (
                    <div key={index} className="mb-4 w-full">
                      <h4 className="mb-2 text-lg font-bold">Dot {index + 1}</h4>
                      <label
                        htmlFor={`dot-position-${index}`}
                        className="mb-2 block"
                      >
                        Select dot position:
                      </label>
                      <select
                        id={`dot-position-${index}`}
                        value={dot.position}
                        onChange={(e) =>
                          handleDotChange(index, "position", e.target.value)
                        }
                        className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
                      >
                        {[
                          ...new Set([
                            parseInt(dot.position),
                            ...availablePositions,
                          ]),
                        ]
                          .sort((a, b) => a - b)
                          .map((pos) => (
                            <option key={`pos-${pos}`} value={pos.toString()}>
                              Position {pos}
                            </option>
                          ))}
                      </select>
                      <label
                        htmlFor={`dot-color-${index}`}
                        className="mb-2 block"
                      >
                        Select dot color:
                      </label>
                      <select
                        id={`dot-color-${index}`}
                        value={dot.color}
                        onChange={(e) =>
                          handleDotChange(index, "color", e.target.value)
                        }
                        className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
                      >
                        {["blue", "green", "red", "purple", "orange"].map(
                          (color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ),
                        )}
                      </select>
                      <label
                        htmlFor={`dot-shape-${index}`}
                        className="mb-2 block"
                      >
                        Select dot shape:
                      </label>
                      <select
                        id={`dot-shape-${index}`}
                        value={dot.shape}
                        onChange={(e) =>
                          handleDotChange(index, "shape", e.target.value)
                        }
                        className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-center text-black"
                      >
                        {["circle", "square", "triangle"].map((shape) => (
                          <option key={shape} value={shape}>
                            {shape}
                          </option>
                        ))}
                      </select>
                      {dots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDot(index)}
                          className="mt-2 rounded-md bg-red-500 px-4 py-2 text-white"
                        >
                          Remove Dot
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddDot}
                    className="add-dot-button mb-4 rounded-md border border-black bg-blue-500 px-4 py-2 text-white"
                  >
                    Add Another Dot
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNumberSenseItem}
                    className="flex size-10 items-center justify-center rounded-full border border-black bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
                    title="Add Number Sense Item"
                  >
                    +
                  </button>
                </>
              ) : category === "Science" && initialType === "periodicTable" ? (
                <>
                  <label htmlFor="element-select" className="mb-2">
                    Select an element:
                  </label>
                  <select
                    id="element-select"
                    value={selectedElement}
                    onChange={handleElementSelect}
                    className="font-teacher mb-4 w-full rounded-md border border-black p-2"
                  >
                    <option value="">Select an element</option>
                    {Object.values(periodicTable).map((element) => (
                      <option
                        key={element.atomicNumber}
                        value={JSON.stringify(element)}
                      >
                        {element.symbol} - {element.name} - {element.atomicNumber}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex size-10 items-center justify-center rounded-full border border-black bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
                    title="Add Item"
                  >
                    +
                  </button>
                </>
              ) : category === "Science" || category === "Nursing" ? (
                <>
                  <label htmlFor="term-select" className="mb-2">
                    Select a {category.toLowerCase()} term:
                  </label>
                  <select
                    id="term-select"
                    value={selectedTerm}
                    onChange={handleTermSelect}
                    className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-black"
                  >
                    <option value="">Select a term</option>
                    {terms.map((term, index) => (
                      <option key={index} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="custom-term-input" className="mb-2">
                    Or enter a custom {category.toLowerCase()} term:
                  </label>
                  <input
                    type="text"
                    id="custom-term-input"
                    value={customTerm}
                    onChange={handleCustomTermChange}
                    className="font-teacher mb-2 w-full rounded-md border border-black p-2 text-black"
                    placeholder={`Enter custom ${category.toLowerCase()} term`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTerm}
                    className="mb-4 rounded-md border border-black bg-blue-500 px-4 py-2 text-white"
                  >
                    Add Term
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <label htmlFor="new-item-input" className="mb-2 text-sm">
                      Type your item below and click the + button to add it to
                      your collection
                    </label>
                    <div className="relative flex w-full items-center">
                      <input
                        type="text"
                        id="new-item-input"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className={`font-teacher w-full rounded-md border border-black p-2 pr-24 ${
                          theme.isDarkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-black"
                        }`}
                        placeholder={`Enter new ${
                          category === "Science"
                            ? "science term"
                            : category === "Nursing"
                              ? "nursing term"
                              : "item"
                        }`}
                      />
                      <div className="absolute right-0 flex items-center pr-2">
                        {newItem && (
                          <span className="mr-2 animate-pulse text-sm text-blue-500">
                            Click + to add →
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className={`flex size-10 items-center justify-center rounded-full ${
                            newItem
                              ? "border border-black bg-green-500 hover:bg-green-600"
                              : "border border-black bg-gray-400"
                          } text-2xl text-white transition duration-300`}
                          title="Add Item"
                          disabled={!newItem}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {visibilityStates.isItemPreviewVisible && (
          <div className="item-preview mt-4 grid grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="mb-2 flex items-center">
                <input
                  type="text"
                  className="font-teacher mr-2 grow rounded-md border border-gray-300 p-2"
                  value={item.name}
                  readOnly
                  title={`Item ${item.id}: ${item.name}`}
                />
                <button
                  className="rounded-md bg-red-500 px-2 py-1 text-white transition duration-300 hover:bg-red-600"
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove Item"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        {visibilityStates.isSaveButtonVisible && (
          <button
            className="save-collection-button bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-black p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
            type="button"
            onClick={handleSaveCollection}
            title="Save Collection"
          >
            Save Collection
          </button>
        )}
        {visibilityStates.isImageUploadVisible && (
          <div className="mb-4 flex flex-col items-center text-center">
            <label
              htmlFor="image-upload"
              className="add-image-button mb-2 mt-4 cursor-pointer rounded-md border border-black bg-blue-500 px-6 py-2 text-white transition duration-300 hover:bg-blue-600"
            >
              Upload Images
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            {images.length > 0 && (
              <div className="item-preview mt-4 grid grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="size-24 object-cover"
                    />
                    {category === "Number Sense" && (
                      <div className="mt-2">
                        <label className="block text-sm font-bold">
                          Number of items in image:
                        </label>
                        <input
                          id={`count-${image.id}`}
                          type="number"
                          value={image.count || ""} // Use empty string when count is 0
                          onChange={(e) => {
                            const value = e.target.value;
                            handleImageCountChange(
                              image.id, 
                              value === "" ? null : parseInt(value)
                            );
                          }}
                          min="0" // Changed from 1 to 0 to allow empty field
                          className="ml-2 w-16 rounded border border-gray-300 px-2 py-1"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <button
                type="button"
                onClick={handleAddImageItem}
                className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
              >
                Add Images to Collection
              </button>
            )}
          </div>
        )}
        {/* Add the GuidedTour component here */}
        <GuidedTour
          steps={steps}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={handleTourStepChange}
          tourName="collectionFinalStep"
        />

        <FeedbackIcon onClick={() => setShowFeedback(true)} />

        {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}{" "}
        {/* Render FeedbackForm */}
      </div>
    </div>
  );
};

export default CollectionFinalStep;
