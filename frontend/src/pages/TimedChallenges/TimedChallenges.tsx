import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchCollections } from "../../api"; // Import the fetchCollections function
import { useAuth0 } from "@auth0/auth0-react";

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

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections(getAccessTokenSilently);
        setCollections(fetchedCollections.filter((collection: Collection) => collection.collection_id != null));
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, [getAccessTokenSilently]);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Timed Challenges</h1>
      <p>
        Complete as many challenges as you can within the time limit!
      </p>
      {isLoading ? (
        <p>Loading collections...</p>
      ) : (
        <div>
          <h2>Your Collections</h2>
          <ul>
            {collections.map((collection: Collection) => ( // Explicitly define the type here
              <li key={collection.collection_id}>
                {collection.name} - {getItemsCount(collection.description)} items
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add your game logic and UI here */}
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
