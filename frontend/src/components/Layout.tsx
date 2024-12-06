import React from "react";
import Navbar from "./Navbar";
import CollectionsNavBar from "./CollectionsNavBar";

interface LayoutProps {
  children: React.ReactNode;
  onStartTour: () => void;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTourStep: React.Dispatch<React.SetStateAction<number>>;
  setShowFeedback: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onStartTour,
  setTourName,
  setCurrentTourStep,
  setShowFeedback,
}) => {
  return (
    <div>
      <Navbar
        onStartTour={onStartTour}
        setTourName={setTourName}
        setCurrentTourStep={setCurrentTourStep}
      />
      <CollectionsNavBar 
        setShowFeedback={setShowFeedback}
        onStartTour={onStartTour}
      />
      {children}
    </div>
  );
};

export default Layout;
