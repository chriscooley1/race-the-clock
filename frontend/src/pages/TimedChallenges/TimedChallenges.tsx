import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchCollections } from "../../api"; // Import the fetchCollections function
import { useAuth0 } from "@auth0/auth0-react";
import { VisibilityStates, tourSteps } from "./tourStepsTimedChallenges"; // Import visibility states and tour steps
import GuidedTour from "../../components/GuidedTour"; // Import GuidedTour

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

  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isTimedChallengesVisible: true,
    isCollectionsOverviewVisible: true,
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps = tourSteps(visibilityStates); // Create tour steps based on visibility states

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections(getAccessTokenSilently);
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
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  useEffect(() => {
    // Start the tour when the component mounts
    startTour();
  }, []);

  // Example of updating visibility states based on some logic
  useEffect(() => {
    // Update visibility states based on your application logic
    if (!isLoading) {
      setVisibilityStates((prev) => ({
        ...prev,
        isCollectionsOverviewVisible: collections.length > 0, // Show if there are collections
      }));
    }
  }, [isLoading, collections]);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } timed-challenges`}
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
      
      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
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
