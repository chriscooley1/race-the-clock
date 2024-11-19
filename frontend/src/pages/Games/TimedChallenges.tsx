import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchCollections } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { tourStepsTimedChallenges } from "./tourStepsTimedChallenges";
import GuidedTour from "../../components/GuidedTour";
import FeedbackForm from "../../components/FeedbackForm";

// Define the Collection interface
interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  category: string;
  user_id: number;
  creator_username: string;
  items: Item[];
  type: string;
}

interface Item {
  name: string;
}

const TimedChallenges: React.FC = () => {
  const { theme } = useTheme();
  const { getAccessTokenSilently } = useAuth0();
  const [collections, setCollections] = useState<Collection[]>([]); // State to hold collections
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false); // State for feedback form visibility

  // Define the steps variable
  const steps = tourStepsTimedChallenges(); // Create tour steps without visibility states

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections(
          getAccessTokenSilently,
        );
        setCollections(
          fetchedCollections.filter(
            (collection: Collection) => collection.collection_id != null,
          ),
        );
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, [getAccessTokenSilently]);

  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  // Call startTour when the component mounts to initiate the tour
  useEffect(() => {
    startTour(); // Start the tour when the component mounts
  }, []);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } timed-challenges mt-4`}
      style={{ color: theme.originalTextColor }}
    >
      <h1 className="mb-8 text-3xl font-bold">Timed Challenges</h1>
      <p>Complete as many challenges as you can within the time limit!</p>
      {isLoading ? (
        <p>Loading collections...</p>
      ) : (
        <div className="collections-overview">
          <h2>Your Collections</h2>
          <ul>
            {collections.map((collection: Collection) => (
              <li key={collection.collection_id}>
                {collection.name} - {getItemsCount(collection.description)}{" "}
                items
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add your game logic and UI here */}
      {/* Button to show feedback form */}
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="bg-light-blue mt-4 rounded px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}{" "}
      {/* Render FeedbackForm */}
      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="timedChallenges"
      />
    </div>
  );
};

// Helper function to count items in a collection description
const getItemsCount = (description: string | undefined): number => {
  if (!description) return 0;
  try {
    const items = JSON.parse(description);
    return Array.isArray(items) ? items.length : 0;
  } catch {
    console.error("Error parsing description:", description);
    return 0;
  }
};

export default TimedChallenges;
