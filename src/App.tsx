import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Display from "./components/Display";
import Settings from "./components/Settings";
import History from "./components/History";
import ThemeSelector from "./components/ThemeSelector";
import FullScreenDisplay from "./components/FullScreenDisplay";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

const App: React.FC = () => {
  const [sequence, setSequence] = React.useState<string[]>([]);
  const [speed, setSpeed] = React.useState<number>(500);
  const { theme } = useTheme();

  const handleUpdate = (newSequence: string[], newSpeed: number) => {
    setSequence(newSequence);
    setSpeed(newSpeed);
  };

  return (
    <Router basename="/letter-reader/">
      <div className={`app-container ${theme.className}`}>
        <ThemeSelector />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Settings onUpdate={handleUpdate} userId={1} />
                <Display sequence={sequence} speed={speed} />
                <History onLoad={(seq) => setSequence(seq)} />
              </>
            }
          />
          <Route
            path="/fullscreen-display"
            element={<FullScreenDisplay />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
