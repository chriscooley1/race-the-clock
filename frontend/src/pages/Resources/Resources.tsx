import React, { useEffect, useState } from "react";
import { tourStepsResources } from "./tourStepsResources";
import GuidedTour from "../../components/GuidedTour";
import BubbleText from "../../components/BubbleText";
import { useTheme } from "../../context/ThemeContext";

interface FAQ {
  question: string;
  answer: string;
}

interface InstructionalVideo {
  title: string;
  description: string;
  videoUrl: string; // URL to the instructional video
}

const Resources: React.FC = () => {
  const { theme } = useTheme();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [videos, setVideos] = useState<InstructionalVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable without visibility states
  const steps = tourStepsResources(); // Create tour steps without visibility states

  // Add a function to start the tour
  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  useEffect(() => {
    // Start the tour when the component mounts
    startTour(); // Call startTour here
  }, []);

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  const handleTourComplete = () => {
    setIsTourRunning(false); // Reset the tour running state
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  useEffect(() => {
    const loadData = async () => {
      // Simulate fetching data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Example FAQs
      setFaqs([
        {
          question: "What is the purpose of this platform?",
          answer: "To help students improve their reading skills.",
        },
        {
          question: "How can I track my progress?",
          answer: "You can view your progress by going to the reports page.",
        },
      ]);

      // Example instructional videos
      setVideos([
        {
          title: "Your Collections",
          description: "Overview of the Your Collections page.",
          videoUrl: "https://www.example.com/video1",
        },
        {
          title: "Discover Collections",
          description: "How to use the Discover Collections page.",
          videoUrl: "https://www.example.com/video2",
        },
        {
          title: "Name Generator",
          description: "Guide on how to use the Name Generator feature.",
          videoUrl: "https://www.example.com/video3",
        },
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getTextColorClass = (backgroundColor: string) => {
    return backgroundColor.toLowerCase() === "#000000" || theme.isDarkMode
      ? "text-white"
      : "text-black";
  };

  return (
    <div
      className={`page-container ${getTextColorClass(theme.backgroundColor)}`}
    >
      <h1 className="inherit mb-8 text-3xl font-bold">
        <BubbleText>Resources</BubbleText>
      </h1>

      {isLoading ? (
        <p className="inherit">Loading resources...</p>
      ) : (
        <>
          <section className="mb-8 w-full max-w-3xl">
            <h2 className="inherit mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="inherit">
                  <h3 className="inherit mb-2 text-xl font-medium">
                    {faq.question}
                  </h3>
                  <p className="inherit">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full max-w-3xl">
            <h2 className="inherit mb-4 text-2xl font-semibold">
              Instructional Videos
            </h2>
            <div className="space-y-6">
              {videos.map((video, index) => (
                <div key={index} className="inherit">
                  <h3 className="inherit mb-2 text-xl font-medium">
                    {video.title}
                  </h3>
                  <p className="inherit">{video.description}</p>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-600"
                  >
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="resources"
      />
    </div>
  );
};

export default Resources;
