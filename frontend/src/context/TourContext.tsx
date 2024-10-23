import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Step } from "react-joyride"; // Import the Step type

// Define the type for the context value
interface TourContextType {
  toursCompleted: Record<string, boolean>;
  completeTour: (tourName: string) => void;
  startTour: (steps: Step[]) => void; // Specify the type for steps
}

// Create the context with a default value of null
const TourContext = createContext<TourContextType | null>(null);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toursCompleted, setToursCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedTours = localStorage.getItem("toursCompleted");
    if (storedTours) {
      setToursCompleted(JSON.parse(storedTours));
    }
  }, []);

  const completeTour = (tourName: string) => {
    setToursCompleted((prev) => ({ ...prev, [tourName]: true }));
    localStorage.setItem("toursCompleted", JSON.stringify({ ...toursCompleted, [tourName]: true }));
  };

  const startTour = (steps: Step[]) => { // Use Step[] as the type for steps
    // Placeholder for starting the tour
    console.log("Starting tour with steps:", steps);
    // Here you would typically call a function from a library like react-joyride
  };

  return (
    <TourContext.Provider value={{ toursCompleted, completeTour, startTour }}>
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
