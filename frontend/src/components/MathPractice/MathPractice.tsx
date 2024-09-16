import React, { useState, useEffect } from "react";
import "./MathPractice.css";

type Operation = "multiplication" | "addition" | "subtraction" | "division";

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

const MathPractice: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [operation, setOperation] = useState<Operation>("multiplication");

  const operationSymbol = {
    multiplication: "×",
    addition: "+",
    subtraction: "−",
    division: "÷"
  };

  useEffect(() => {
    generateProblems();
  }, [operation]);

  const generateProblems = () => {
    const newProblems: Problem[] = [];
    for (let i = 0; i < 10; i++) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      let answer: number;
      switch (operation) {
        case "multiplication": answer = num1 * num2; break;
        case "addition": answer = num1 + num2; break;
        case "subtraction": answer = num1 - num2; break;
        case "division": answer = Number((num1 / num2).toFixed(2)); break;
      }
      newProblems.push({ num1, num2, operation, answer });
    }
    setProblems(newProblems);
    setShowAnswer(false);
  };

  const handleScreenClick = () => {
    if (showAnswer) {
      // Move to next problem
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
      setShowAnswer(false);
    } else {
      // Show answer for current problem
      setShowAnswer(true);
    }
  };

  const handleReviewProblem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnswer(false);
  };

  return (
    <div className="math-practice fullscreen" onClick={handleScreenClick}>
      <div className="problem-display">
        {problems.length > 0 && (
          <>
            <div className="problem">
              {problems[currentProblemIndex].num1} 
              {" " + operationSymbol[problems[currentProblemIndex].operation] + " "}
              {problems[currentProblemIndex].num2} = 
              {showAnswer && <span className="answer">{problems[currentProblemIndex].answer}</span>}
            </div>
            {showAnswer && (
              <button type="button" onClick={handleReviewProblem} className="review-button">
                Review Problem
              </button>
            )}
          </>
        )}
      </div>
      <div className="operation-selector">
        {["multiplication", "addition", "subtraction", "division"].map((op) => (
          <button 
            type="button"
            key={op}
            onClick={() => setOperation(op as Operation)} 
            className={operation === op ? "active" : ""}
          >
            {op.charAt(0).toUpperCase() + op.slice(1)}
          </button>
        ))}
      </div>
      <button type="button" onClick={generateProblems} className="generate-button">Generate New Problems</button>
    </div>
  );
};

export default MathPractice;
