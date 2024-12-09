import React from "react";
import Navbar from "./Navbar";
import CollectionsNavBar from "./CollectionsNavBar";
import Footer from "./Footer";

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
    <div className="flex min-h-screen flex-col">
      <div className="fixed inset-x-0 top-0 z-50">
        <Navbar
          onStartTour={onStartTour}
          setTourName={setTourName}
          setCurrentTourStep={setCurrentTourStep}
        />
      </div>
      <div className="fixed inset-x-0 top-[200px] z-40">
        <CollectionsNavBar 
          setShowFeedback={setShowFeedback}
          onStartTour={onStartTour}
        />
      </div>
      <div className="mt-[264px] flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
