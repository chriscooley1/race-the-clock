import React, { useState, useEffect } from "react";

interface DisplayProps {
  sequence: string[];
  speed: number;
}

const Display: React.FC<DisplayProps> = ({ sequence, speed }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sequence.length);
    }, speed);

    return () => clearInterval(interval);
  }, [sequence, speed]);

  return (
    <div>
      <h1>{sequence[index]}</h1>
    </div>
  );
};

export default Display;
