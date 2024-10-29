import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Step } from "react-joyride"; // Import the Step type

// Define the type for the context value
interface TourContextType {
  toursCompleted: Record<string, boolean>;
  startTour: (steps: Step[]) => void; // Specify the type for steps
  completeTour: () => void; // Add a completeTour function
  isTourRunning: boolean; // Add a state to track if the tour is running
  setIsTourRunning: (isRunning: boolean) => void; // Function to set the tour running state
}

// Create the context with a default value of null
const TourContext = createContext<TourContextType | null>(null);

export const TourProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toursCompleted, setToursCompleted] = useState<Record<string, boolean>>({});
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false); // Track if the tour is running

  useEffect(() => {
    const storedTours = localStorage.getItem("toursCompleted");
    if (storedTours) {
      setToursCompleted(JSON.parse(storedTours));
    }
  }, []);

  const startTour = (steps: Step[]) => {
    setIsTourRunning(true); // Set the tour as running
    console.log("Starting tour with steps:", steps);
    // Here you would typically call a function from a library like react-joyride
  };

  const completeTour = () => {
    // Logic to mark the tour as completed
    console.log("Tour completed");
  };

  return (
    <TourContext.Provider value={{ toursCompleted, startTour, completeTour, isTourRunning, setIsTourRunning }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
