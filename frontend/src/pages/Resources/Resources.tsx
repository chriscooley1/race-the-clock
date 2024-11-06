import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsResources } from "./tourStepsResources";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";

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
    isDotCountTypeVisible: false,
    isMinDotsVisible: false,
    isMaxDotsVisible: false,
    isTypeSelectVisible: false,
    isItemCountVisible: false,
    isCollectionItemCountVisible: false,
    isDotColorVisible: false,
    isDotShapeVisible: false,
    isGenerateRandomSequenceButtonVisible: false,
    isFileUploadVisible: false,
    isNextButtonVisible: false,
    isClearButtonVisible: false,
    isGeneratedSequencePreviewVisible: false,
    isBadgesSectionVisible: false,
    isAchievementsSectionVisible: false,
    isLoadingMessageVisible: false,
    isSearchInputVisible: false,
    isSortSelectVisible: false,
    isCollectionsGridVisible: false,
    isPreviewButtonVisible: false,
    isSaveButtonVisible: false,
    isItemPreviewVisible: false,
    isMathProblemVisible: false,
    isDotButtonVisible: false,
    isImageUploadVisible: false,
    isPreviousButtonVisible: false,
    isProgressIndicatorVisible: false,
    isPauseButtonVisible: false,
    isScreenClickAreaVisible: false,
    isMatchingGameVisible: false,
    isMultipleWordsGameVisible: false,
    isRegisterButtonVisible: false,
    isLoginButtonVisible: false,
    isProfileVisible: false,
    isUpdateFormVisible: false,
    isNameInputVisible: false,
    isAddNameButtonVisible: false,
    isSpinButtonVisible: false,
    isNamesListVisible: false,
    isCollectionNameVisible: false,
    isCategorySelectVisible: false,
    isStageSelectVisible: false,
    isPublicCheckboxVisible: false,
    isSubmitButtonVisible: false,
    isReportsOverviewVisible: false,
    isReportsListVisible: false,
    isFAQSectionVisible: true,
    isInstructionalVideosVisible: true,
    isTimedChallengesVisible: false,
    isCollectionsOverviewVisible: false,
    isCollectionCardVisible: false,
    isStartCollectionButtonVisible: false,
    isEditCollectionButtonVisible: false,
    isDeleteCollectionButtonVisible: false,
    isMainFontVisible: false,
    isHeadingFontVisible: false,
    isButtonFontVisible: false,
    isColorThemeVisible: false,
    isTextColorVisible: false,
    isBackgroundColorVisible: false,
    isAccessibilityVisible: false,
    isBackgroundThemeVisible: false,
    isSessionSettingsModalVisible: false,
    isEditCollectionModalVisible: false,
    isDuplicateCollectionModalVisible: false,
    isCollectionPreviewModalVisible: false,
  });

  // Define the steps variable
  const steps = tourStepsResources(visibilityStates); // Create tour steps based on visibility states

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

  // Example of using setVisibilityStates
  useEffect(() => {
    // Here you can set visibility states based on your logic
    const newVisibilityStates: VisibilityStates = {
      isDotCountTypeVisible: false,
      isMinDotsVisible: false,
      isMaxDotsVisible: false,
      isTypeSelectVisible: false,
      isItemCountVisible: false,
      isCollectionItemCountVisible: false,
      isDotColorVisible: false,
      isDotShapeVisible: false,
      isGenerateRandomSequenceButtonVisible: false,
      isFileUploadVisible: false,
      isNextButtonVisible: false,
      isClearButtonVisible: false,
      isGeneratedSequencePreviewVisible: false,
      isBadgesSectionVisible: false,
      isAchievementsSectionVisible: false,
      isLoadingMessageVisible: false,
      isSearchInputVisible: false,
      isSortSelectVisible: false,
      isCollectionsGridVisible: false,
      isPreviewButtonVisible: false,
      isSaveButtonVisible: false,
      isItemPreviewVisible: false,
      isMathProblemVisible: false,
      isDotButtonVisible: false,
      isImageUploadVisible: false,
      isPreviousButtonVisible: false,
      isProgressIndicatorVisible: false,
      isPauseButtonVisible: false,
      isScreenClickAreaVisible: false,
      isMatchingGameVisible: false,
      isMultipleWordsGameVisible: false,
      isRegisterButtonVisible: false,
      isLoginButtonVisible: false,
      isProfileVisible: false,
      isUpdateFormVisible: false,
      isNameInputVisible: false,
      isAddNameButtonVisible: false,
      isSpinButtonVisible: false,
      isNamesListVisible: false,
      isCollectionNameVisible: false,
      isCategorySelectVisible: false,
      isStageSelectVisible: false,
      isPublicCheckboxVisible: false,
      isSubmitButtonVisible: false,
      isReportsOverviewVisible: false,
      isReportsListVisible: false,
      isFAQSectionVisible: true,
      isInstructionalVideosVisible: true,
      isTimedChallengesVisible: false,
      isCollectionsOverviewVisible: false,
      isCollectionCardVisible: false,
      isStartCollectionButtonVisible: false,
      isEditCollectionButtonVisible: false,
      isDeleteCollectionButtonVisible: false,
      isMainFontVisible: false,
      isHeadingFontVisible: false,
      isButtonFontVisible: false,
      isColorThemeVisible: false,
      isTextColorVisible: false,
      isBackgroundColorVisible: false,
      isAccessibilityVisible: false,
      isBackgroundThemeVisible: false,
      isSessionSettingsModalVisible: false,
      isEditCollectionModalVisible: false,
      isDuplicateCollectionModalVisible: false,
      isCollectionPreviewModalVisible: false,
    };
    setVisibilityStates(newVisibilityStates);
  }, []); // This effect runs once when the component mounts

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

  const toggleFAQVisibility = () => {
    setVisibilityStates((prev) => ({
      ...prev,
      isFAQSectionVisible: !prev.isFAQSectionVisible,
    }));
  };

  useEffect(() => {
    console.log("Resources component mounted");
    return () => {
      console.log("Resources component unmounted");
    };
  }, []);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } resources`}
    >
      <h1 className="mb-8 text-3xl font-bold">Resources</h1>
      <button type="button" onClick={toggleFAQVisibility}>
        Toggle FAQ Visibility
      </button>

      {isLoading ? (
        <p>Loading resources...</p>
      ) : (
        <>
          {visibilityStates.isFAQSectionVisible && (
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
          )}
          {visibilityStates.isInstructionalVideosVisible && (
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
          )}
        </>
      )}

      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="resources"
      />
    </div>
  );
};

export default Resources;
