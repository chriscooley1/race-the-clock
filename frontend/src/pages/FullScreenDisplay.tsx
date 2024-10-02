import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

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
  count?: number;
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
  const [progress, setProgress] = useState(0);

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
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % shuffledSequence.length;
          setProgress((newIndex / shuffledSequence.length) * 100);
          return newIndex;
        });
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

  const getTextClass = (text: string) => {
    if (text.length <= 5) return "short-text";
    if (text.length <= 10) return "medium-text";
    if (text.length <= 15) return "long-text";
    if (text.length <= 20) return "very-long-text";
    return "extremely-long-text";
  };

  const renderContent = () => {
    const currentItem = shuffledSequence[index];
    if (category === "Science" && type === "periodicTable") {
      const [symbol, name, atomicNumber] = currentItem.name.split(" - ");
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className={`text-[20vw] m-0 ${getTextClass(atomicNumber)}`}>{atomicNumber}</h1>
          <h2 className={`text-[10vw] m-0 ${getTextClass(name)}`}>{name}</h2>
          <h3 className={`text-[15vw] m-0 ${getTextClass(symbol)}`}>{symbol}</h3>
        </div>
      );
    } else if (category === "Math" && type === "mathProblems") {
      return (
        <h1 className={`text-[15vw] leading-tight break-words max-w-[90vw] text-center transition-all duration-300 ${currentItem.isAnswer ? "text-green-500" : "text-red-500"} ${getTextClass(currentItem.name)}`}>
          {currentItem.name}
        </h1>
      );
    } else if (category === "Number Sense") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          {currentItem?.svg ? (
            <img 
              src={currentItem.svg} 
              alt={`Number sense ${currentItem.name}`} 
              className="max-w-full max-h-full object-contain" 
            />
          ) : (
            <p>No image available for {currentItem.name}</p>
          )}
        </div>
      );
    } else {
      return <h1 className={`text-[15vw] leading-tight break-words max-w-[90vw] text-center transition-all duration-300 ${getTextClass(currentItem.name)}`}>{currentItem.name}</h1>;
    }
  };

  return (
    <>
      <Navbar isPaused={isPaused} onPauseResume={handlePauseResume} />
      <div 
        className="flex items-center justify-center h-screen w-screen relative transition-colors duration-300 overflow-hidden m-0 p-0"
        style={{ color: theme.displayTextColor || theme.textColor, backgroundColor: theme.displayBackgroundColor || theme.backgroundColor }}
        onClick={handleScreenClick}
      >
        {renderContent()}
        <button type="button" className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-5xl w-15 h-15 flex items-center justify-center rounded-full hover:bg-opacity-70 transition-colors duration-300" onClick={handlePrevious}>←</button>
        <button type="button" className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-5xl w-15 h-15 flex items-center justify-center rounded-full hover:bg-opacity-70 transition-colors duration-300" onClick={handleNext}>→</button>
        <div className="fixed bottom-2.5 left-2.5 right-2.5 h-2.5 bg-white bg-opacity-30 rounded-full">
          <div className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="fixed bottom-7 left-2.5 text-xs" style={{ color: theme.displayTextColor || theme.textColor }}>
          {Math.round(progress)}% Complete
        </div>
      </div>
    </>
  );
};

export default FullScreenDisplay;