import React, { useEffect, useState } from "react";
import { fetchCollections } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { tourStepsTimedChallenges } from "./tourStepsTimedChallenges";
import GuidedTour from "../../components/GuidedTour";
import { useTour } from "../../context/TourContext";
import { useNavigate } from "react-router-dom";
import BubbleText from "../../components/BubbleText";

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
  const { getAccessTokenSilently } = useAuth0();
  const [collections, setCollections] = useState<Collection[]>([]); // State to hold collections
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const { isGuidedTourEnabled, isTourRunning, setIsTourRunning } = useTour();
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const navigate = useNavigate();

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

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted_timedChallenges", "true");
  };

  const handleBack = () => {
    navigate("/games");
  };

  return (
    <div className="page-container">
      <button
        type="button"
        onClick={handleBack}
        className="fixed left-4 z-40 mt-[20px] rounded border border-black bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Back to Games
      </button>
      <h1 className="mb-8 text-3xl font-bold">
        <BubbleText>Timed Challenges</BubbleText>
      </h1>
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
      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning && isGuidedTourEnabled}
        onComplete={handleTourComplete}
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
