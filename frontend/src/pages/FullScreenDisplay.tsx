import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

interface CollectionItem {
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
  const { sequence, speed, shuffle, category, type } =
    location.state as FullScreenDisplayState;
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
        }))
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

  useEffect(() => {
    if (
      shuffledSequence.length > 0 &&
      !isPaused &&
      (category !== "Math" ||
        (type !== "mathProblems" && type !== "Math Problems"))
    ) {
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
    setIndex(
      (prevIndex) =>
        (prevIndex - 1 + shuffledSequence.length) % shuffledSequence.length,
    );
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
    if (text.length <= 5) return "text-[clamp(25vw,30vw,35vw)]";
    if (text.length <= 10) return "text-[clamp(15vw,19vw,23vw)]";
    if (text.length <= 15) return "text-[clamp(8vw,12vw,16vw)]";
    if (text.length <= 20) return "text-[clamp(5vw,9vw,13vw)]";
    return "text-[clamp(3vw,7vw,11vw)]"; // For very long text
  };

  const renderContent = () => {
    const currentItem = shuffledSequence[index];
    console.log('Rendering item:', currentItem);

    if (category === "Number Sense") {
      return (
        <div className="flex size-full items-center justify-center">
          {currentItem.svg ? (
            <img
              src={currentItem.svg}
              alt={currentItem.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              onError={(e) => console.error('Error loading image:', e)}
            />
          ) : (
            <p>No image available for {currentItem.name}</p>
          )}
        </div>
      );
    } else if (category === "Choose File" || currentItem.svg) {
      return (
        <div className="flex size-full items-center justify-center">
          <img
            src={currentItem.svg}
            alt={currentItem.name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
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
    } else if (category === "Math" && type === "mathProblems") {
      return (
        <h1
          className={`max-w-[90vw] break-words text-center leading-tight transition-all duration-300 ${getTextClass(currentItem.name)}`}
        >
          {currentItem.name}
        </h1>
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
      <Navbar isPaused={isPaused} onPauseResume={handlePauseResume} />
      <div
        className="relative m-0 flex h-screen w-screen items-center justify-center overflow-hidden p-0 transition-colors duration-300"
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
          className="w-15 h-15 absolute left-5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-5xl text-white transition-colors duration-300 hover:bg-black/70"
          onClick={handlePrevious}
        >
          ←
        </button>
        <button
          type="button"
          className="w-15 h-15 absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-5xl text-white transition-colors duration-300 hover:bg-black/70"
          onClick={handleNext}
        >
          →
        </button>
        <div className="fixed inset-x-2.5 bottom-2.5 h-2.5 rounded-full bg-white/30">
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
      </div>
    </>
  );
};

export default FullScreenDisplay;
