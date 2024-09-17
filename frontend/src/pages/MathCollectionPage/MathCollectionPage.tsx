import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./MathCollectionPage.css"; // We'll create this CSS file
import Navbar from "../../components/Navbar/Navbar";

interface MathProblem {
  id: number;
  name: string;
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
    document.documentElement.style.setProperty("--display-text-color", theme.displayTextColor || theme.textColor);
    document.documentElement.style.setProperty("--background-color", theme.displayBackgroundColor || theme.backgroundColor);

    return () => {
      document.documentElement.style.setProperty("--display-text-color", theme.textColor);
      document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
    };
  }, [theme]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % problems.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + problems.length) % problems.length);
    setShowAnswer(false);
  };

  const handleScreenClick = () => {
    if (!showAnswer) {
      setShowAnswer(true);
    } else {
      handleNext();
    }
  };

  if (!collection || problems.length === 0) {
    return <div>No valid problems found in this collection.</div>;
  }

  const currentProblem = problems[currentIndex];

  return (
    <>
      <Navbar 
        onBack={handleBack}
        showBackButton={true}
      />
      <div className="math-collection-container" onClick={handleScreenClick}>
        <h1 className="math-problem">{currentProblem.name}</h1>
        {showAnswer && (
          <h2 className="math-answer">
            {eval(currentProblem.name.replace("×", "*").replace("÷", "/"))}
          </h2>
        )}
        <button type="button" className="nav-button left" onClick={(e) => { e.stopPropagation(); handlePrevious(); }}>←</button>
        <button type="button" className="nav-button right" onClick={(e) => { e.stopPropagation(); handleNext(); }}>→</button>
      </div>
    </>
  );
};

export default MathCollectionPage;
