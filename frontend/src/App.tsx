import React, { useState } from "react";
import Display from "./components/Display";
import Settings from "./components/Settings";
import History from "./components/History";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSelector from "./components/ThemeSelector"; // Import the ThemeSelector component

const App: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(500);

  const handleUpdate = (newSequence: string[], newSpeed: number) => {
    console.log("handleUpdate called with:", newSequence, newSpeed);
    setSequence(newSequence);
    setSpeed(newSpeed);
  };

  return (
    <ThemeProvider> {/* Wrap the app with ThemeProvider */}
      <div>
        <ThemeSelector /> {/* Add ThemeSelector component */}
        <Settings onUpdate={handleUpdate} userId={1} />
        <Display sequence={sequence} speed={speed} />
        <History onLoad={(seq) => setSequence(seq)} />
      </div>
    </ThemeProvider>
  );
};

export default App;
