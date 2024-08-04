import React from "react";
import ThemeSelector from "./ThemeSelector";
import Settings from "./Settings";
import History from "./History";
import Display from "./Display";

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
