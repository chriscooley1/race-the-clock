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

const FullScreenDisplay: React.FC<FullScreenDisplayProps> = ({
  onEnterFullScreen,
  onExitFullScreen,
}) => {
  const location = useLocation();
  const { sequence, speed, shuffle, category } = location.state;
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [shuffledSequence, setShuffledSequence] = useState<CollectionItem[]>([]);
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
        newShuffledSequence = shuffleArray([...sequence]);
      } else {
        newShuffledSequence = [...sequence];
      }
      console.log("New shuffled sequence:", newShuffledSequence);
      setShuffledSequence(newShuffledSequence);
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
    if (shuffledSequence.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        if (category === "Number Sense") {
          // For Number Sense, don't auto-advance
          return;
        }
        setIndex((prevIndex) => (prevIndex + 1) % shuffledSequence.length);
      }, speed);
      setIntervalId(interval as unknown as number);
      return () => clearInterval(interval);
    }
  }, [shuffledSequence, speed, isPaused, category]);

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

  const handleScreenClick = (e: React.MouseEvent) => {
    if (category === "Number Sense") {
      handleNext(e);
    }
  };

  // Add this check at the beginning of the component
  if (!shuffledSequence.length) {
    return <div>Loading...</div>;
  }

  console.log("Rendering with index:", index);
  console.log("Current item:", shuffledSequence[index]);

  return (
    <>
      <Navbar isPaused={isPaused} onPauseResume={handlePauseResume} />
      <div className="fullscreen-container" onClick={handleScreenClick}>
        {category === "Number Sense" ? (
          <div className="number-sense-container">
            {shuffledSequence[index]?.svg && (
              <img 
                src={shuffledSequence[index].svg} 
                alt={`Number sense ${shuffledSequence[index].name}`} 
                className="fullscreen-image" 
              />
            )}
          </div>
        ) : (
          <h1 className="fullscreen-text">{shuffledSequence[index]?.name || ""}</h1>
        )}
        <button type="button" className="nav-button left" onClick={handlePrevious}>←</button>
        <button type="button" className="nav-button right" onClick={handleNext}>→</button>
      </div>
    </>
  );
};

export default FullScreenDisplay;
