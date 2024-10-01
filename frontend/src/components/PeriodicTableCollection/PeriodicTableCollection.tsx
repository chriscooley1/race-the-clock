import React, { useState } from "react";

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
    <div className="flex justify-center items-center h-[calc(100vh-60px)] text-2xl md:text-3xl cursor-pointer" onClick={handleClick}>
      <div className="border-2 border-gray-700 p-4 md:p-6 text-center bg-gray-100 rounded-md">
        <div className="text-5xl md:text-6xl font-bold">{currentElement.symbol}</div>
        {showDetails && (
          <>
            <div className="text-xl md:text-2xl mt-2">{currentElement.name}</div>
            <div className="text-lg md:text-xl mt-1">{currentElement.atomicNumber}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodicTableCollection;
