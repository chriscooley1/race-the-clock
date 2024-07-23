import React, { useState } from "react";
import Display from "./components/Display";
import Settings from "./components/Settings";
import History from "./components/History";

const App: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(500);

  const handleUpdate = (newSequence: string[], newSpeed: number) => {
    setSequence(newSequence);
    setSpeed(newSpeed);
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
