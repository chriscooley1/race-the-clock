import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { tourStepsFullScreenDisplay } from "./tourStepsFullScreenDisplay";
import GuidedTour from "../../components/GuidedTour";
import FeedbackForm from "../../components/FeedbackForm";
import { useTour } from "../../context/TourContext";

interface CollectionItem {
  name: string;
  svg?: string;
  count?: number;
}

interface FullScreenDisplayProps {
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
  setShowFeedback: (show: boolean) => void;
}

interface FullScreenDisplayState {
  sequence: Array<{
    name: string;
    svg?: string;
    count?: number;
  }>;
  duration: number;
  speed: number;
  textColor: string;
  shuffle: boolean;
  category: string;
  type: string;
  answerDisplayTime: number;
  timerMinutes: number;
  timerSeconds: number;
}

interface SequenceItem {
  name: string;
  isAnswer?: boolean;
  svg?: string;
  count?: number;
}

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({
  onEnterFullScreen,
  onExitFullScreen,
  setShowFeedback,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("FullScreenDisplay state:", location.state);
  const {
    sequence,
    speed,
    shuffle,
    category,
    type,
    answerDisplayTime,
    timerMinutes,
    timerSeconds,
  } = location.state as FullScreenDisplayState;
  console.log("Destructured values:", {
    sequence,
    speed,
    shuffle,
    category,
    type,
  });
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<SequenceItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stopCondition, setStopCondition] = useState("collection");
  const [tourName, setTourName] = useState<string>("");
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const { isGuidedTourEnabled } = useTour();

  // Create tour steps without visibility states
  const steps = tourStepsFullScreenDisplay();

  const shuffleArray = (array: CollectionItem[]): CollectionItem[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    console.log("Entering FullScreenDisplay with state:", location.state);
    onEnterFullScreen();

    if (sequence && sequence.length > 0) {
      let newShuffledSequence;
      if (shuffle) {
        console.log("Shuffling sequence...");
        newShuffledSequence = shuffleArray(
          sequence.map((item, index) => ({ ...item, id: index })),
        );
      } else {
        newShuffledSequence = [...sequence];
      }
      console.log("New shuffled sequence:", newShuffledSequence);
      setShuffledSequence(
        newShuffledSequence.map((item, index) => ({
          ...item,
          id: index,
          name: item.name,
          svg: item.svg || "",
          count: item.count || 0,
          isAnswer: false,
        })),
      );
    } else {
      console.error("Sequence is empty or undefined");
    }

    document.documentElement.style.setProperty(
      "--display-text-color",
      theme.displayTextColor || theme.textColor,
    );
    document.documentElement.style.setProperty(
      "--background-color",
      theme.displayBackgroundColor || theme.backgroundColor,
    );

    return () => {
      console.log("Exiting FullScreenDisplay");
      document.documentElement.style.setProperty(
        "--display-text-color",
        theme.textColor,
      );
      document.documentElement.style.setProperty(
        "--background-color",
        theme.backgroundColor,
      );
      onExitFullScreen(); // Ensure this is called to reset sidebar
    };
  }, [
    onEnterFullScreen,
    onExitFullScreen,
    sequence,
    shuffle,
    theme,
    location.state,
  ]);

  // Add this new effect to handle the initial display
  useEffect(() => {
    if (
      shuffledSequence.length > 0 &&
      (category === "Number Sense" ||
        (category === "Math" && type === "mathProblems"))
    ) {
      setShowAnswer(false);
      const timer = setTimeout(() => {
        setShowAnswer(true);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [shuffledSequence, category, type, speed]);

  const handleEndSession = useCallback(() => {
    console.log("Ending session..."); // Debug log
    if (stopCondition === "timer") {
      // Check if stopCondition is "timer"
      console.log(
        "Session ended due to timer. Redirecting to Your Collections...",
      );
      navigate("/your-collections");
    } else {
      console.log("Session ended. Redirecting to Your Collections...");
      navigate("/your-collections");
    }
    setStopCondition("timer"); // Update stopCondition as needed
  }, [stopCondition, navigate]); // Include dependencies

  // Move this useEffect below the handleEndSession declaration
  useEffect(() => {
    if (
      shuffledSequence.length > 0 &&
      !isPaused &&
      (category === "Number Sense" ||
        (category === "Math" && type === "mathProblems"))
    ) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % shuffledSequence.length;
          setProgress((newIndex / shuffledSequence.length) * 100);
          setShowAnswer(false);
          setTimeout(() => setShowAnswer(true), speed);

          // Check if we are about to wrap around to the first item
          if (newIndex === 0 && stopCondition === "collection") {
            handleEndSession(); // Call the function to handle session end
          }

          return newIndex;
        });
      }, speed + answerDisplayTime);
      setIntervalId(interval as unknown as number);
      return () => clearInterval(interval);
    } else if (shuffledSequence.length > 0 && !isPaused) {
      // For other categories, just cycle through items without showing answers
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % shuffledSequence.length;
          setProgress((newIndex / shuffledSequence.length) * 100);
          // Check if we are about to wrap around to the first item
          if (newIndex === 0 && stopCondition === "collection") {
            handleEndSession(); // Call the function to handle session end
          }
          return newIndex;
        });
      }, speed);
      setIntervalId(interval as unknown as number);
      return () => clearInterval(interval);
    }
  }, [
    shuffledSequence,
    speed,
    isPaused,
    category,
    type,
    answerDisplayTime,
    stopCondition,
    handleEndSession, // Ensure this is included
  ]);

  useEffect(() => {
    if (stopCondition === "timer") {
      const totalTimerSeconds = timerMinutes * 60 + timerSeconds; // Calculate total timer seconds
      console.log(`Timer set for ${totalTimerSeconds} seconds`); // Debug log
      const timer = setTimeout(() => {
        console.log("Timer expired, ending session."); // Debug log
        handleEndSession(); // Call the function to handle session end
      }, totalTimerSeconds * 1000); // Convert to milliseconds
      return () => clearTimeout(timer);
    }
  }, [stopCondition, timerMinutes, timerSeconds, handleEndSession]); // Add timer dependencies

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (isPaused && intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex(
      (prevIndex) =>
        (prevIndex - 1 + shuffledSequence.length) % shuffledSequence.length,
    );
  };

  const handleScreenClick = () => {
    if (
      category === "Number Sense" ||
      (category === "Math" && type === "mathProblems")
    ) {
      setShowAnswer(!showAnswer);
    }
  };

  const handleStartTour = () => {
    console.log("Starting Tour");
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  // Add this check at the beginning of the component
  if (!shuffledSequence.length) {
    return <div>Loading...</div>;
  }

  console.log("Rendering with index:", index);
  console.log("Current item:", shuffledSequence[index]);

  const getTextClass = (text: string) => {
    if (text.length <= 4) return "text-[clamp(25vw,30vw,35vw)]";
    if (text.length <= 7) return "text-[clamp(15vw,19vw,23vw)]";
    if (text.length <= 12) return "text-[clamp(8vw,12vw,16vw)]";
    if (text.length <= 15) return "text-[clamp(5vw,9vw,13vw)]";
    return "text-[clamp(2vw,6vw,10vw)]"; // For very long text
  };

  const renderContent = () => {
    const currentItem = shuffledSequence[index];

    if (category === "Number Sense") {
      if (showAnswer) {
        return (
          <div className="flex size-full items-center justify-center">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="size-64">
                <polygon
                  points="100,10 40,180 190,60 10,60 160,180"
                  fill="yellow"
                  stroke="orange"
                  strokeWidth="5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-orange-600">
                  {currentItem.count}
                </span>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex size-full items-center justify-center">
            {currentItem.svg ? (
              <img
                src={currentItem.svg}
                alt={currentItem.name}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onError={(e) => console.error("Error loading image:", e)}
              />
            ) : (
              <h1
                className={`max-w-[90vw] break-words text-center leading-tight transition-all duration-300 ${getTextClass(currentItem.name)}`}
              >
                {currentItem.name}
              </h1>
            )}
          </div>
        );
      }
    } else if (category === "Math" && type === "mathProblems") {
      const [problem, answer] = currentItem.name.split("|");
      if (showAnswer) {
        return (
          <div className="flex size-full items-center justify-center">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="size-64">
                <polygon
                  points="100,10 40,180 190,60 10,60 160,180"
                  fill="yellow"
                  stroke="orange"
                  strokeWidth="5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-orange-600">
                  {answer}
                </span>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex size-full items-center justify-center">
            <h1
              className={`max-w-[90vw] break-words text-center leading-tight transition-all duration-300 ${getTextClass(problem)}`}
            >
              {problem}
            </h1>
          </div>
        );
      }
    } else if (category === "Choose File" || currentItem.svg) {
      return (
        <div className="flex size-full items-center justify-center">
          <img
            src={currentItem.svg}
            alt={currentItem.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      );
    } else if (category === "Science" && type === "periodicTable") {
      const [symbol, name, atomicNumber] = currentItem.name.split(" - ");
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className={`m-0 ${getTextClass(atomicNumber)}`}>
            {atomicNumber}
          </h1>
          <h2 className={`m-0 ${getTextClass(name)}`}>{name}</h2>
          <h3 className={`m-0 ${getTextClass(symbol)}`}>{symbol}</h3>
        </div>
      );
    } else {
      return (
        <h1
          className={`max-w-[90vw] break-words text-center leading-tight transition-all duration-300 ${getTextClass(currentItem.name)}`}
        >
          {currentItem.name}
        </h1>
      );
    }
  };

  return (
    <>
      <Navbar
        isPaused={isPaused}
        onPauseResume={handlePauseResume}
        onStartTour={handleStartTour}
        setTourName={setTourName}
        setCurrentTourStep={setCurrentTourStep}
        setShowFeedback={setShowFeedback}
      />
      <div
        className="full-screen-display relative m-0 mt-4 flex h-screen w-screen items-center justify-center overflow-hidden p-0 transition-colors duration-300"
        style={{
          color: theme.displayTextColor || theme.textColor,
          backgroundColor:
            theme.displayBackgroundColor || theme.backgroundColor,
        }}
        onClick={handleScreenClick}
      >
        {renderContent()}
        <button
          type="button"
          className="w-15 h-15 previous-button absolute left-5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-5xl text-white transition-colors duration-300 hover:bg-black/70"
          onClick={handlePrevious}
        >
          ←
        </button>
        <button
          type="button"
          className="w-15 h-15 next-button absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-5xl text-white transition-colors duration-300 hover:bg-black/70"
          onClick={handleNext}
        >
          →
        </button>
        <div className="progress-indicator fixed inset-x-2.5 bottom-2.5 h-2.5 rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div
          className="fixed bottom-7 left-2.5 text-xs"
          style={{ color: theme.displayTextColor || theme.textColor }}
        >
          {Math.round(progress)}% Complete
        </div>
        {isGuidedTourEnabled && (
          <GuidedTour
            steps={steps}
            isRunning={isTourRunning}
            onComplete={handleTourComplete}
            currentStep={currentTourStep}
            onStepChange={setCurrentTourStep}
            tourName={tourName}
          />
        )}
      </div>

      {isFeedbackVisible && (
        <FeedbackForm onClose={() => setIsFeedbackVisible(false)} />
      )}
    </>
  );
};

export default FullScreenDisplay;
