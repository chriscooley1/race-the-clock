import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./FullScreenDisplay.css";
import "../../App.css";
import Navbar from "../../components/Navbar/Navbar";

interface CollectionItem {
  id: number;
  name: string;
  svg?: string;
  count?: number;
}

interface FullScreenDisplayProps {
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
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
}

interface SequenceItem {
  name: string;
  isAnswer?: boolean;
  svg?: string;
}

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({
  onEnterFullScreen,
  onExitFullScreen,
}) => {
  const location = useLocation();
  console.log("FullScreenDisplay state:", location.state);
  const { sequence, speed, shuffle, category, type } = location.state as FullScreenDisplayState;
  console.log("Destructured values:", { sequence, speed, shuffle, category, type });
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<SequenceItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

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
        newShuffledSequence = shuffleArray(sequence.map((item, index) => ({ ...item, id: index })));
      } else {
        newShuffledSequence = [...sequence];
      }
      console.log("New shuffled sequence:", newShuffledSequence);
      setShuffledSequence(newShuffledSequence.map((item, index) => ({
        ...item,
        id: index, // Use the index as a number id
        answer: item.name, // Use the name property instead of answer
        svg: item.svg || "" // Provide a default empty string if svg is undefined
      })));
    } else {
      console.error("Sequence is empty or undefined");
    }

    document.documentElement.style.setProperty("--display-text-color", theme.displayTextColor || theme.textColor);
    document.documentElement.style.setProperty("--background-color", theme.displayBackgroundColor || theme.backgroundColor);

    return () => {
      console.log("Exiting FullScreenDisplay");
      document.documentElement.style.setProperty("--display-text-color", theme.textColor);
      document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
      onExitFullScreen(); // Ensure this is called to reset sidebar
    };
  }, [onEnterFullScreen, onExitFullScreen, sequence, shuffle, theme, location.state]);

  useEffect(() => {
    if (shuffledSequence.length > 0 && !isPaused && (category !== "Math" || (type !== "mathProblems" && type !== "Math Problems"))) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
      }, speed);
      setIntervalId(interval as unknown as number);
      return () => clearInterval(interval);
    }
  }, [shuffledSequence, speed, isPaused, category, type]);

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
    setIndex((prevIndex) => (prevIndex - 1 + shuffledSequence.length) % shuffledSequence.length);
  };

  const handleScreenClick = () => {
    if (category === "Math" && type === "mathProblems") {
      handleNext({ stopPropagation: () => {} } as React.MouseEvent);
    }
  };

  // Add this check at the beginning of the component
  if (!shuffledSequence.length) {
    return <div>Loading...</div>;
  }

  console.log("Rendering with index:", index);
  console.log("Current item:", shuffledSequence[index]);

  const renderContent = () => {
    const currentItem = shuffledSequence[index];
    if (category === "Math" && type === "mathProblems") {
      return (
        <>
          <h1 className={`fullscreen-text ${currentItem.isAnswer ? "answer" : "problem"}`}>
            {currentItem.name}
          </h1>
        </>
      );
    } else if (category === "Number Sense") {
      return (
        <div className="number-sense-container">
          {currentItem?.svg ? (
            <img 
              src={currentItem.svg} 
              alt={`Number sense ${currentItem.name}`} 
              className="fullscreen-image" 
            />
          ) : (
            <p>No image available for {currentItem.name}</p>
          )}
        </div>
      );
    } else {
      return <h1 className="fullscreen-text">{currentItem.name}</h1>;
    }
  };

  return (
    <>
      <Navbar isPaused={isPaused} onPauseResume={handlePauseResume} />
      <div className="fullscreen-container" onClick={handleScreenClick}>
        {renderContent()}
        <button type="button" className="nav-button left" onClick={handlePrevious}>←</button>
        <button type="button" className="nav-button right" onClick={handleNext}>→</button>
      </div>
    </>
  );
};

export default FullScreenDisplay;
