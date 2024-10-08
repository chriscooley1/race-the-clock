import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Add this import
import Navbar from "../components/Navbar";

interface MathProblem {
  id: number;
  name: string;
  answer?: number;
}

const MathCollectionPage: React.FC = () => {
  const location = useLocation();
  const { collection } = location.state || {};
  const { theme } = useTheme();
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/your-collections");
  };

  useEffect(() => {
    if (collection && collection.description) {
      const parsedProblems = JSON.parse(collection.description);
      setProblems(parsedProblems);
    }
  }, [collection]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--display-text-color",
      theme.displayTextColor || theme.textColor,
    );
    document.documentElement.style.setProperty(
      "--background-color",
      theme.displayBackgroundColor || theme.backgroundColor,
    );

    return () => {
      document.documentElement.style.setProperty(
        "--display-text-color",
        theme.textColor,
      );
      document.documentElement.style.setProperty(
        "--background-color",
        theme.backgroundColor,
      );
    };
  }, [theme]);

  const handleNext = () => {
    if (showAnswer) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % problems.length);
      setShowAnswer(false);
    } else {
      setShowAnswer(true);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + problems.length) % problems.length,
    );
    setShowAnswer(false);
  };

  const handleScreenClick = () => {
    handleNext();
  };

  if (!collection || problems.length === 0) {
    return <div>No valid problems found in this collection.</div>;
  }

  const currentProblem = problems[currentIndex];

  const getAnswer = (problem: string): number => {
    if (currentProblem.answer !== undefined) {
      return currentProblem.answer;
    }
    return eval(problem.replace("×", "*").replace("÷", "/"));
  };

  return (
    <>
      <Navbar onBack={handleBack} hasBackButton={true} />
      <div
        className="relative m-0 mt-[50px] flex h-[calc(100vh-50px)] w-screen flex-col items-center justify-center overflow-hidden bg-[var(--background-color)] p-0 text-[var(--display-text-color,var(--text-color))] transition-colors duration-300"
        onClick={handleScreenClick}
      >
        <h1 className="m-0 px-5 text-center text-[10vw] leading-none text-inherit md:text-[20vw]">
          {showAnswer ? getAnswer(currentProblem.name) : currentProblem.name}
        </h1>
        <button
          type="button"
          className="md:w-15 md:h-15 absolute left-2.5 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-3xl text-white hover:bg-black/70 md:text-5xl"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
        >
          ←
        </button>
        <button
          type="button"
          className="md:w-15 md:h-15 absolute right-2.5 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-3xl text-white hover:bg-black/70 md:text-5xl"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          →
        </button>
      </div>
    </>
  );
};

export default MathCollectionPage;
