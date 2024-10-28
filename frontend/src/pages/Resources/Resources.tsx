import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { VisibilityStates, tourSteps } from "./tourStepsResources"; // Import the visibility states and tour steps
import GuidedTour from "../../components/GuidedTour"; // Import GuidedTour

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

  const [visibilityStates, setVisibilityStates] = useState<VisibilityStates>({
    isFAQSectionVisible: true,
    isInstructionalVideosVisible: true,
  });

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
          answer: "You can view your progress in the dashboard.",
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

  // Start the tour when the component mounts
  useEffect(() => {
    setIsTourRunning(true);
    setCurrentTourStep(0); // Reset to the first step

    // Optionally, you can set visibility states here based on your logic
    setVisibilityStates({
      isFAQSectionVisible: true, // Set based on your logic
      isInstructionalVideosVisible: true, // Set based on your logic
    });
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } resources`}
    >
      <h1 className="mb-8 text-3xl font-bold">Resources</h1>

      {isLoading ? (
        <p>Loading resources...</p>
      ) : (
        <>
          <section className="mb-8 w-full max-w-3xl">
            <h2 className="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="mb-2 text-xl font-medium">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full max-w-3xl">
            <h2 className="mb-4 text-2xl font-semibold">
              Instructional Videos
            </h2>
            <div className="space-y-6">
              {videos.map((video, index) => (
                <div key={index}>
                  <h3 className="mb-2 text-xl font-medium">{video.title}</h3>
                  <p>{video.description}</p>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={tourSteps(visibilityStates)}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
      />
    </div>
  );
};

export default Resources;
