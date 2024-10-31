import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { Step, CallBackProps } from "react-joyride";
import Joyride from "react-joyride";

// Extend CallBackProps to include tourName
export interface ExtendedCallBackProps extends CallBackProps {
  tourName?: string; // Add tourName as an optional property
}

// Define the type for the context value
interface TourContextType {
  toursCompleted: Record<string, boolean>;
  startTour: (steps: Step[]) => void;
  completeTour: (tourName: string) => void;
  isTourRunning: boolean;
  setIsTourRunning: (isRunning: boolean) => void;
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
  const [steps, setSteps] = useState<Step[]>([]); // Store steps in state
  const joyrideRef = useRef<Joyride | null>(null); // Specify the type for Joyride ref

  useEffect(() => {
    const storedTours = localStorage.getItem("toursCompleted");
    if (storedTours) {
      setToursCompleted(JSON.parse(storedTours));
    }
  }, []);

  const startTour = (tourSteps: Step[]) => {
    setSteps(tourSteps); // Set the steps for the tour
    setIsTourRunning(true); // Set the tour running state
    console.log("Starting tour with steps:", tourSteps);
  };

  const completeTour = (tourName: string) => {
    if (tourName !== "navbar") {
      setToursCompleted((prev) => ({ ...prev, [tourName]: true }));
      localStorage.setItem(
        "toursCompleted",
        JSON.stringify({ ...toursCompleted, [tourName]: true }),
      );
    }
    console.log("Tour completed:", tourName);
  };

  return (
    <TourContext.Provider
      value={{
        toursCompleted,
        startTour,
        completeTour,
        isTourRunning,
        setIsTourRunning,
      }}
    >
      {children}
      <Joyride
        ref={joyrideRef}
        steps={steps} // Pass the steps from state
        run={isTourRunning} // Control the running state
        continuous
        showSkipButton
        showProgress
        callback={(data: ExtendedCallBackProps) => {
          if (data.status === "finished" || data.status === "skipped") {
            completeTour(data.tourName || ""); // Call completeTour when the tour is finished or skipped
            setIsTourRunning(false); // Set tour running state to false
          }
        }}
      />
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
