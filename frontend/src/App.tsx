import React from "react";
import Display from "./components/Display";
import Settings from "./components/Settings";
import History from "./components/History";
import ThemeSelector from "./components/ThemeSelector";
import { useTheme } from "./context/ThemeContext";
import './App.css'; // Import the global CSS file

const App: React.FC = () => {
  const [sequence, setSequence] = React.useState<string[]>([]);
  const [speed, setSpeed] = React.useState<number>(500);
  const { theme } = useTheme();

  const handleUpdate = (newSequence: string[], newSpeed: number) => {
    setSequence(newSequence);
    setSpeed(newSpeed);
  };

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.color, minHeight: '100vh', width: '100vw' }}>
      <ThemeSelector /> {/* Include ThemeSelector here */}
      <Settings onUpdate={handleUpdate} userId={1} />
      <Display sequence={sequence} speed={speed} />
      <History onLoad={(seq) => setSequence(seq)} />
    </div>
  );
};

export default App;
