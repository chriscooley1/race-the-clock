import React, { useState } from "react";
import "./MathCollection.css";

interface MathProblem {
  num1: number;
  num2: number;
  operation: string;
  answer: number;
}

interface MathCollectionProps {
  problems: MathProblem[];
}

const MathCollection: React.FC<MathCollectionProps> = ({ problems }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const operationSymbol = {
    multiplication: "×",
    addition: "+",
    subtraction: "−",
    division: "÷"
  };

  const handleClick = () => {
    if (showAnswer) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
      setShowAnswer(false);
    } else {
      setShowAnswer(true);
    }
  };

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="math-collection" onClick={handleClick}>
      <div className="problem">
        {currentProblem.num1} {operationSymbol[currentProblem.operation as keyof typeof operationSymbol]} {currentProblem.num2} = 
        {showAnswer && <span className="answer">{currentProblem.answer}</span>}
      </div>
    </div>
  );
};

export default MathCollection;
