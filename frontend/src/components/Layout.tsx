import React from "react";
import Navbar from "./Navbar";
import CollectionsNavBar from "./CollectionsNavBar";
import { useState } from "react";
import FeedbackForm from "./FeedbackForm";

interface LayoutProps {
  children: React.ReactNode;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onStartTour,
  setTourName,
  setCurrentTourStep,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [sortOption, setSortOption] = useState<string>("date");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleDuplicateCollection = () => {
    // Implement if needed
  };

  return (
    <div>
      <Navbar
        onStartTour={onStartTour}
        setTourName={setTourName}
        setCurrentTourStep={setCurrentTourStep}
        setShowFeedback={setShowFeedback}
      />
      <CollectionsNavBar
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        onDuplicateCollection={handleDuplicateCollection}
        setShowFeedback={setShowFeedback}
      />
      {children}
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
    </div>
  );
};

export default Layout;
