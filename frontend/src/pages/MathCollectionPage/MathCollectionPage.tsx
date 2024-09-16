import React from "react";
import { useLocation } from "react-router-dom";
import MathCollection from "../../components/MathCollection/MathCollection";

const MathCollectionPage: React.FC = () => {
  const location = useLocation();
  const { collection } = location.state || {};

  if (!collection) {
    return <div>No collection data found.</div>;
  }

  console.log("Raw collection description:", collection.description);

  const problems = JSON.parse(collection.description).map((item: any) => {
    if (item && typeof item.name === "string") {
      const parts = item.name.split(" × ");
      if (parts.length === 2) {
        return {
          num1: parseInt(parts[0]),
          num2: parseInt(parts[1]),
          operation: "multiplication",
          answer: parseInt(parts[0]) * parseInt(parts[1]),
        };
      }
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
