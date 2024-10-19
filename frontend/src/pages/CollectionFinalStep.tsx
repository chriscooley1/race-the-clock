import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { saveCollection, getCurrentUser } from "../api";
import { periodicTable, PeriodicElement } from "../utils/periodicTable";
import { User } from "../types/user";
import { useTheme } from "../context/ThemeContext";
import { generateCountingSvg, generateScienceTerms, generateNursingTerms } from "../utils/RandomGenerators";

// Export the function to avoid the "unused" error
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
    Array.from({ length: 25 }, (_, i) => i + 1)
  );

  // Add this new state
  const [selectedPositions, setSelectedPositions] = useState<number[]>([1]);

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
    setDots([...dots, { position: newPosition.toString(), color: "blue", shape: "circle", count: 1 }]);
    setSelectedPositions([...selectedPositions, newPosition]);
    setAvailablePositions(prev => prev.filter(pos => pos !== newPosition));
  };

  const handleRemoveDot = (index: number) => {
    const removedPosition = parseInt(dots[index].position);
    setDots(dots.filter((_, i) => i !== index));
    setSelectedPositions(selectedPositions.filter((_, i) => i !== index));
    setAvailablePositions(prev => [...prev, removedPosition].sort((a, b) => a - b));
  };

  const handleDotChange = (index: number, field: keyof Dot, value: string | number) => {
    const newDots = [...dots];
    if (field === 'position') {
      const oldPosition = parseInt(newDots[index].position);
      const newPosition = parseInt(value as string);
      
      // Update selectedPositions
      const newSelectedPositions = [...selectedPositions];
      newSelectedPositions[index] = newPosition;
      setSelectedPositions(newSelectedPositions);
      
      // Update availablePositions
      setAvailablePositions(prev => {
        const updated = [...prev, oldPosition].filter(pos => 
          !newSelectedPositions.includes(pos) && pos !== newPosition
        );
        return updated.sort((a, b) => a - b);
      });
      
      // Update the position in the dots state
      newDots[index].position = newPosition.toString();
    } else if (field === 'count') {
      newDots[index][field] = value as number;
    } else {
      newDots[index][field] = value as string;
    }
    setDots(newDots);
  };

  const combineSvgs = (svgs: string[]): string => {
    console.log('SVGs to combine:', svgs);
    const svgWidth = 200;
    const svgHeight = 200;
    const decodedSvgs = svgs.map(svg => decodeURIComponent(svg.split(',')[1]));
    const combinedSvgContent = decodedSvgs.join('');
    const result = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">${combinedSvgContent}</svg>`;
    console.log('Combined SVG:', result);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result)}`;
  };

  const handleAddNumberSenseItem = () => {
    const svgs = dots.map((dot) =>
      generateCountingSvg(dot.count, dot.color, dot.shape, dot.position)
    );

    const combinedSvg = combineSvgs(svgs);

    const newItem = {
      id: items.length + 1,
      name: `Number Sense: ${dots.reduce((sum, dot) => sum + dot.count, 0)} dot(s)`,
      svg: combinedSvg,
      count: dots.reduce((sum, dot) => sum + dot.count, 0),
    };
    console.log('New item SVG:', newItem.svg);
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
      console.error("Current user is not set");
      return;
    }

    try {
      const collectionData = items.map((item) => ({
        name: item.name,
        svg: item.svg,
        count: item.count,
      }));

      console.log("Saving collection with data:", {
        username: currentUser.username,
        collectionName,
        collectionData,
        isPublic,
        category,
        type: "numberSense",
      });

      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        "numberSense",
        getAccessTokenSilently,
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
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

    setItems([
      ...items,
      { id: items.length + 1, name: problemString },
      { id: items.length + 2, name: answer.toString() },
    ]);
  };

  const handleTermSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(event.target.value);
    setCustomTerm("");
  };

  const handleCustomTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  if (!currentUser) {
    return <div>Loading user information...</div>;
  }

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center pl-[250px] pt-[60px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="text-4xl font-bold">Step 3 - Custom</h1>
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
              className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
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
              className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
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
              className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
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
              className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
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
                    <label htmlFor={`dot-position-${index}`} className="mb-2 block">
                      Select dot position:
                    </label>
                    <select
                      id={`dot-position-${index}`}
                      value={dot.position}
                      onChange={(e) => handleDotChange(index, "position", e.target.value)}
                      className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
                    >
                      {[...new Set([parseInt(dot.position), ...availablePositions])]
                        .sort((a, b) => a - b)
                        .map((pos) => (
                          <option key={`pos-${pos}`} value={pos.toString()}>
                            Position {pos}
                          </option>
                        ))}
                    </select>
                    <label htmlFor={`dot-color-${index}`} className="mb-2 block">
                      Select dot color:
                    </label>
                    <select
                      id={`dot-color-${index}`}
                      value={dot.color}
                      onChange={(e) =>
                        handleDotChange(index, "color", e.target.value)
                      }
                      className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
                    >
                      {["blue", "green", "red", "purple", "orange"].map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={`dot-shape-${index}`} className="mb-2 block">
                      Select dot shape:
                    </label>
                    <select
                      id={`dot-shape-${index}`}
                      value={dot.shape}
                      onChange={(e) =>
                        handleDotChange(index, "shape", e.target.value)
                      }
                      className="mb-2 w-full rounded-md border border-gray-300 p-2 text-center font-['Caveat'] text-black"
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
                  className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  Add Another Dot
                </button>
                <button
                  type="button"
                  onClick={handleAddNumberSenseItem}
                  className="flex size-10 items-center justify-center rounded-full bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
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
                  className="mb-4 w-full rounded-md border border-gray-300 p-2 font-['Caveat']"
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
              </>
            ) : (category === "Science" || category === "Nursing") ? (
              <>
                <label htmlFor="term-select" className="mb-2">
                  Select a {category.toLowerCase()} term:
                </label>
                <select
                  id="term-select"
                  value={selectedTerm}
                  onChange={handleTermSelect}
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-black"
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
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-black"
                  placeholder={`Enter custom ${category.toLowerCase()} term`}
                />
                <button
                  type="button"
                  onClick={handleAddTerm}
                  className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  Add Term
                </button>
              </>
            ) : (
              <>
                <label htmlFor="new-item-input" className="sr-only">
                  New Item
                </label>
                <input
                  type="text"
                  id="new-item-input"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 font-['Caveat']"
                  placeholder={`Enter new ${
                    category === "Science"
                      ? "science term"
                      : category === "Nursing"
                      ? "nursing term"
                      : "item"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex size-10 items-center justify-center rounded-full bg-green-500 text-2xl text-white transition duration-300 hover:bg-green-600"
                  title="Add Item"
                >
                  +
                </button>
              </>
            )}
          </>
        )}
      </div>
      {items.map((item) => (
        <div key={item.id} className="mb-2 flex items-center">
          {item.svg ? (
            <div className="mr-2 items-center">
              <img 
                src={item.svg} 
                alt={item.name} 
                className="mr-2 size-12" 
                onError={(e) => console.error('Error loading image:', e)}
              />
              <span>{item.name}</span>
            </div>
          ) : (
            <input
              type="text"
              className="mr-2 grow rounded-md border border-gray-300 p-2 font-['Caveat']"
              value={item.name}
              readOnly
              title={`Item ${item.id}: ${item.name}`}
            />
          )}
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
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        type="button"
        onClick={handleSaveCollection}
        title="Save Collection"
      >
        Save Collection
      </button>
    </div> 
  );
};

export default CollectionFinalStep;
