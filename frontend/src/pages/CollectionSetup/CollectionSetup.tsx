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

type Operation = "multiplication" | "addition" | "subtraction" | "division" | "PeriodicElement";

interface User {
  username: string;
  id: string;
  name: string;
  email: string;
}

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
        type, // Add this line
      });
      await saveCollection(
        currentUser.username,
        collectionName,
        collectionData,
        isPublic ? "public" : "private",
        category,
        type, // Add this parameter
        getAccessTokenSilently
      );
      navigate("/your-collections");
    } catch (error) {
      console.error("Error saving collection:", error);
      alert("There was an error saving your collection. Please try again.");
    }
  };

  if (!currentUser) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="collection-setup-container">
      <h1>Collection: {collectionName}</h1>
      <h2>Step 2 - Set Up Collection Body</h2>
      <div className="setup-centered-input">
        <label htmlFor="itemCount">Quantity #:</label>
        <input
          type="number"
          id="itemCount"
          className="setup-custom-input"
          value={itemCount}
          min={1}
          onChange={(e) => {
            const count = parseInt(e.target.value, 10);
            setItemCount(count);
          }}
          placeholder="Enter number of items"
          title="Enter the number of items"
        />
      </div>
      <div className="setup-centered-input">
        <label htmlFor="typeSelect">Type:</label>
        <select
          id="typeSelect"
          className="setup-custom-input"
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
      <button
        type="button"
        onClick={generateRandomSequence}
        className="setup-styled-button"
        disabled={type === "mathProblems" && !operation}
      >
        Generate Random Sequence
      </button>
      <p>- OR -</p>
      <div className="setup-centered-input">
        <label htmlFor="fileUpload">Choose File</label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          title="Choose a file to upload"
        />
      </div>
      <button
        type="button"
        onClick={sequence.length > 0 ? handleSaveCollection : handleNext}
        className="setup-styled-button"
      >
        {sequence.length > 0 ? "Save Collection" : "Next"}
      </button>
      {sequence.length > 0 && (
        <div>
          <h3>Generated Sequence:</h3>
          <p>{sequence.join(", ")}</p>
        </div>
      )}
      {category === "Number Sense" && numberSenseItems.length > 0 && (
        <div>
          <h3>Generated Number Sense Images:</h3>
          <div className="picture-grid">
            {numberSenseItems.map((image, index) => (
              <div key={index} className="number-sense-image">
                <img src={image.url || image.svg} alt={`Number Sense Image ${index + 1}`} />
                <p>Count: {image.count}</p>
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
