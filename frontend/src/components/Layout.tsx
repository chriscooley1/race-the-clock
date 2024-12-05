import React from "react";
import Navbar from "./Navbar";
import CollectionsNavBar from "./CollectionsNavBar";

interface LayoutProps {
  children: React.ReactNode;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
  tourName?: string;
  setShowFeedback: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onStartTour,
  setTourName,
  setCurrentTourStep,
  setShowFeedback,
  tourName = "default",
}) => {
  return (
    <div>
      <Navbar
        setShowFeedback={setShowFeedback}
        onStartTour={onStartTour}
        setTourName={setTourName}
        setCurrentTourStep={setCurrentTourStep}
        currentTourName={tourName}
      />
      <CollectionsNavBar setShowFeedback={setShowFeedback} />
      {children}
    </div>
  );
};

export default Layout;
