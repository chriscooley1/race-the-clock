import React from "react";
import feedbackIcon from "../assets/feedback.png";

interface FeedbackIconProps {
  onClick: () => void;
}

const FeedbackIcon: React.FC<FeedbackIconProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-transform hover:scale-110 active:scale-95"
      aria-label="Open Feedback Form"
    >
      <img 
        src={feedbackIcon} 
        alt="Feedback" 
        className="w-8 h-8 cursor-pointer"
      />
    </button>
  );
};

export default FeedbackIcon; 