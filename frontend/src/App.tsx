import React, { useState, useEffect } from "react";
import Display from "./components/Display";
import Settings from "./components/Settings";
import History from "./components/History";

const App: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(500);

  useEffect(() => {
    const savedSequence = localStorage.getItem("currentSequence");
    if (savedSequence) {
      setSequence(JSON.parse(savedSequence));
    }
    const savedSpeed = localStorage.getItem("currentSpeed");
    if (savedSpeed) {
      setSpeed(Number(savedSpeed));
    }
  }, []);

  const handleUpdate = (newSequence: string[], newSpeed: number) => {
    setSequence(newSequence);
    setSpeed(newSpeed);
    localStorage.setItem("currentSequence", JSON.stringify(newSequence));
    localStorage.setItem("currentSpeed", newSpeed.toString());
  };

  return (
    <div>
      <Settings onUpdate={handleUpdate} />
      <Display sequence={sequence} speed={speed} />
      <History onLoad={(seq) => setSequence(seq)} />
    </div>
  );
};

export default App;
