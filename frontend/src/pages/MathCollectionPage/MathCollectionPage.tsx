import React from "react";
import { useLocation } from "react-router-dom";
import MathCollection from "../../components/MathCollection/MathCollection";

interface MathProblem {
  id: number;
  name: string;
  problem: string;
  answer: number;
}

const MathCollectionPage: React.FC = () => {
  const location = useLocation();
  const { collection } = location.state || {};

  if (!collection) {
    return <div>No collection data found.</div>;
  }

  console.log("Raw collection description:", collection.description);

  const problems = JSON.parse(collection.description).map((item: MathProblem) => {
    if (item && typeof item.problem === "string" && typeof item.answer === "number") {
      const [num1, operation, num2] = item.problem.split(/\s*([\+\-\×\÷])\s*/);
      return {
        num1: parseInt(num1),
        num2: parseInt(num2),
        operation: operation,
        answer: item.answer,
      };
    }
    console.error(`Invalid item structure:`, JSON.stringify(item, null, 2));
    return null;
  }).filter(Boolean);

  return (
    <div className="math-collection-page">
      <h1>{collection.name}</h1>
      {problems.length > 0 ? (
        <MathCollection problems={problems} />
      ) : (
        <div>No valid problems found in this collection.</div>
      )}
    </div>
  );
};

export default MathCollectionPage;
