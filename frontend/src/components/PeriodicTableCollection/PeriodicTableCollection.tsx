import React, { useState } from "react";
import "./PeriodicTableCollection.css";

interface PeriodicElement {
  id: number;
  name: string;
  symbol: string;
  atomicNumber: number;
}

interface PeriodicTableCollectionProps {
  elements: PeriodicElement[];
}

const PeriodicTableCollection: React.FC<PeriodicTableCollectionProps> = ({ elements }) => {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    if (showDetails) {
      setCurrentElementIndex((prevIndex) => (prevIndex + 1) % elements.length);
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  };

  const currentElement = elements[currentElementIndex];

  return (
    <div className="periodic-table-collection" onClick={handleClick}>
      <div className="element">
        <div className="element-symbol">{currentElement.symbol}</div>
        {showDetails && (
          <>
            <div className="element-name">{currentElement.name}</div>
            <div className="atomic-number">{currentElement.atomicNumber}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodicTableCollection;
