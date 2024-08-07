import React from "react";
import ThemeSelector from "../components/ThemeSelector";
import Settings from "../components/Settings";
import History from "../components/History";
import Display from "../components/Display";

interface HomePageProps {
  handleSettingsUpdate: (sequence: string[], speed: number) => void;
  handleHistoryLoad: (sequence: string[]) => void;
  userId: number;
}

const HomePage: React.FC<HomePageProps> = ({
  handleSettingsUpdate,
  handleHistoryLoad,
  userId,
}) => {
  return (
    <div className="home-page">
      <ThemeSelector />
      <Settings onUpdate={handleSettingsUpdate} userId={userId} />
      <History onLoad={handleHistoryLoad} />
      <Display sequence={[]} speed={500} />
    </div>
  );
};

export default HomePage;
