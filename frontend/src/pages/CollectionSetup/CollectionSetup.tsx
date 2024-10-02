import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionSetup.css";
import "../../App.css"; 
import {
  generateRandomLetters,
  generateRandomNumbers,
  generateFullAlphabet,
  generateNumbersOneToHundred,
  generateMathProblems,
  generateNumberSenseImages,
  generatePeriodicTableElements,
  generateScienceTerms,
  generateNursingTerms
} from "../../utils/RandomGenerators";
import { saveCollection, getCurrentUser } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../../types/user";

type Operation = "multiplication" | "addition" | "subtraction" | "division" | "PeriodicElement";

const CollectionSetup: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionName, isPublic, category } = location.state || {};

  const [file, setFile] = useState<File | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [type, setType] = useState<string>("letters");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [numberSenseItems, setNumberSenseItems] = useState<{ url?: string; svg?: string; count: number }[]>([]);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");
        const fetchedUser = await getCurrentUser(getAccessTokenSilently);
        console.log("Fetched user:", fetchedUser);
        if (isUser(fetchedUser)) {
          const userWithDefaults: User = {
            ...fetchedUser,
            id: fetchedUser.id || generateId(),
            name: fetchedUser.name || "Default Name",
            username: fetchedUser.username || "defaultUsername",
            email: fetchedUser.email || "default@example.com"
          };
          setCurrentUser(userWithDefaults);
        } else {
          console.error("Fetched user is missing required properties:", fetchedUser);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, [getAccessTokenSilently]);
  
  useEffect(() => {
    console.log("User data in state:", currentUser);
  }, [currentUser]);

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
  }, [category]);

  useEffect(() => {
    if (type === "mathProblems" && !operation) {
      setOperation("addition"); // Set a default operation
    }
  }, [type, operation]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSequence([]); // Clear any existing sequence
    }
  };

  const generateRandomSequence = () => {
    let generatedSequence: string[] = [];
    switch (type) {
      case "numbers":
        generatedSequence = generateRandomNumbers(itemCount);
        break;
      case "letters":
        generatedSequence = generateRandomLetters(itemCount);
        break;
      case "alphabet":
        generatedSequence = generateFullAlphabet();
        break;
      case "numbersOneToHundred":
        generatedSequence = generateNumbersOneToHundred();
        break;
      case "mathProblems":
        if (operation && operation !== "PeriodicElement") {
          const problems = generateMathProblems(itemCount, operation);
          generatedSequence = problems.map((item) => item);
        } else {
          console.error("Math Problems selected but operation is not set or is PeriodicElement");
        }
        break;
      case "numberSense": {
        const images = generateNumberSenseImages(itemCount);
        setNumberSenseItems(images);
        generatedSequence = images.map((image, index) => `Number Sense Image ${index + 1} (Count: ${image.count})`);
        break;
      }
      case "periodicTable":
        generatedSequence = generatePeriodicTableElements(itemCount);
        break;
      case "scienceTerms":
        generatedSequence = generateScienceTerms(itemCount);
        break;
      case "nursingTerms":
        generatedSequence = generateNursingTerms(itemCount);
        break;
      default:
        console.error("Invalid type selected");
    }
    setSequence(generatedSequence);
    setFile(null);
  };

  const handleNext = () => {
    if (!collectionName) {
      alert("Collection name is missing. Please go back and enter a name.");
      return;
    }

    navigate("/collection-final-step", {
      state: { collectionName, isPublic, category, itemCount, file, sequence },
    });
  };

  const handleSaveCollection = async () => {
    console.log("User data before saving collection:", currentUser);

    try {
      if (!currentUser || !currentUser.username) {
        throw new Error("Current user is undefined");
      }

      const collectionData = sequence.map((name, index) => ({
        id: index + 1,
        name,
        svg: type === "numberSense" ? numberSenseItems[index]?.svg : undefined,
        count: type === "numberSense" ? numberSenseItems[index]?.count : undefined,
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
        getAccessTokenSilently
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
      alert("There was an error saving your collection. Please try again.");
    }
  };

  if (!currentUser) {
    return <div className="text-center p-4">Loading user information...</div>;
  }

  return (
    <div className="flex flex-col items-center p-5 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Collection</h1>
      <div className="w-full space-y-4">
        <div>
          <label htmlFor="nameInput" className="block mb-2 font-bold">Name:</label>
          <input
            type="text"
            id="nameInput"
            className="w-full p-2 border border-gray-300 rounded-md font-['Caveat']"
            value={collectionName}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="categorySelect" className="block mb-2 font-bold">Category:</label>
          <select
            id="categorySelect"
            className="w-full p-2 border border-gray-300 rounded-md font-['Caveat']"
            value={category}
            disabled
          >
            <option value="">Select a category</option>
            <option value="Math">Math</option>
            <option value="Language Arts">Language Arts</option>
            <option value="Number Sense">Number Sense</option>
            <option value="Science">Science</option>
            <option value="Nursing">Nursing</option>
          </select>
        </div>
        <div>
          <label htmlFor="typeSelect" className="block mb-2 font-bold">Type:</label>
          <select
            id="typeSelect"
            className="w-full p-2 border border-gray-300 rounded-md font-['Caveat']"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
                <option value="letters">Letters</option>
                <option value="alphabet">Full Alphabet</option>
              </>
            )}
            {category === "Number Sense" && (
              <option value="numberSense">Random Pictures</option>
            )}
            {category === "Science" && (
              <>
                <option value="periodicTable">Periodic Table</option>
                <option value="scienceTerms">Science Terms</option>
              </>
            )}
            {category === "Nursing" && (
              <option value="nursingTerms">Nursing Terms</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="itemCount" className="block mb-2 font-bold">Quantity #:</label>
          <input
            type="number"
            id="itemCount"
            className="w-full p-2 border border-gray-300 rounded-md font-['Caveat']"
            value={itemCount}
            min={1}
            onChange={(e) => {
              const count = parseInt(e.target.value, 10);
              setItemCount(count);
            }}
          />
        </div>
        <button
          type="button"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 font-bold uppercase"
          onClick={generateRandomSequence}
        >
          Generate Random Sequence
        </button>
        <p className="text-center">- OR -</p>
        <div>
          <label htmlFor="fileUpload" className="block mb-2 font-bold">Choose File:</label>
          <input
            type="file"
            id="fileUpload"
            className="w-full p-2 border border-gray-300 rounded-md font-['Caveat']"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 font-bold uppercase"
          onClick={sequence.length > 0 ? handleSaveCollection : handleNext}
        >
          {sequence.length > 0 ? "Save Collection" : "Next"}
        </button>
      </div>
      {sequence.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Generated Sequence:</h3>
          <p className="text-lg">{sequence.join(", ")}</p>
        </div>
      )}
      {category === "Number Sense" && numberSenseItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Generated Number Sense Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {numberSenseItems.map((image, index) => (
              <div key={index} className="border border-gray-300 rounded-md p-2">
                <img src={image.url || image.svg} alt={`Number Sense Image ${index + 1}`} className="w-full h-auto" />
                <p className="text-center mt-2">Count: {image.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionSetup;

// Define the type guard function
function isUser(user: unknown): user is User {
  return typeof user === "object" && user !== null && typeof (user as User).username === "string";
}

// Define the function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
