import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Step, CallBackProps } from "react-joyride";

// Extend CallBackProps to include tourName
export interface ExtendedCallBackProps extends CallBackProps {
  tourName?: string; // Add tourName as an optional property
}

// Define the type for the context value
interface TourContextType {
  toursCompleted: Record<string, boolean>;
  startTour: (steps: Step[]) => void;
  completeTour: (tourName: string) => void;
  resetTourState: () => void;
  isTourRunning: boolean;
  setIsTourRunning: (isRunning: boolean) => void;
  isGuidedTourEnabled: boolean;
  setIsGuidedTourEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  currentTourStep: number;
  setCurrentTourStep: (step: number) => void;
}

// Create the context with a default value of null
const TourContext = createContext<TourContextType | null>(null);

export const TourProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toursCompleted, setToursCompleted] = useState<Record<string, boolean>>(
    {},
  );
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [isGuidedTourEnabled, setIsGuidedTourEnabled] = useState<boolean>(
    () => {
      const storedPreference = localStorage.getItem("guidedTourEnabled");
      return storedPreference ? JSON.parse(storedPreference) : true;
    },
  );
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  useEffect(() => {
    const storedTours = localStorage.getItem("toursCompleted");
    if (storedTours) {
      setToursCompleted(JSON.parse(storedTours));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "guidedTourEnabled",
      JSON.stringify(isGuidedTourEnabled),
    );
  }, [isGuidedTourEnabled]);

  const resetTourState = () => {
    setIsTourRunning(false);
    setCurrentTourStep(0);
    // Clear any stored tour state in localStorage
    localStorage.removeItem("currentTourStep");
  };

  const startTour = (tourSteps: Step[]) => {
    resetTourState(); // Reset state before starting new tour
    setIsTourRunning(true);
    setCurrentTourStep(0);
    console.log("Starting tour with steps:", tourSteps);
  };

  const completeTour = (tourName: string) => {
    if (tourName !== "navbar") {
      const updatedTours = { ...toursCompleted, [tourName]: true };
      setToursCompleted(updatedTours);
      localStorage.setItem("toursCompleted", JSON.stringify(updatedTours));
    }
    resetTourState();
  };

  return (
    <TourContext.Provider
      value={{
        toursCompleted,
        startTour,
        completeTour,
        resetTourState,
        isTourRunning,
        setIsTourRunning,
        isGuidedTourEnabled,
        setIsGuidedTourEnabled,
        currentTourStep,
        setCurrentTourStep,
      }}
    >
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
