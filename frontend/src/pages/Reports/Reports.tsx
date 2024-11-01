import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchReports, fetchCollections } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { tourStepsReports } from "./tourStepsReports";
import GuidedTour from "../../components/GuidedTour";
import { VisibilityStates } from "../../types/VisibilityStates";

// Define the Report interface
interface Report {
  report_id: number;
  user_id: number;
  total_items: number;
  time_taken: number; // in seconds
  missed_items: number;
  skipped_items: number;
  created_at: string;
}

// Define the Collection interface
interface Collection {
  collection_id: number;
  name: string;
}

const Reports: React.FC = () => {
  const { theme } = useTheme();
  const { getAccessTokenSilently } = useAuth0();
  const [reports, setReports] = useState<Report[]>([]); // State to hold reports
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [collections, setCollections] = useState<Collection[]>([]); // State to hold collections

  // Visibility states for the tour
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
    isReportsOverviewVisible: true,
    isReportsListVisible: true,
    isFAQSectionVisible: false,
    isInstructionalVideosVisible: false,
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
  });

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable
  const steps = tourStepsReports(visibilityStates); // Create tour steps based on visibility states

  useEffect(() => {
    const loadReports = async () => {
      try {
        const fetchedReports = await fetchReports(getAccessTokenSilently);
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections(
          getAccessTokenSilently,
        );
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Error loading collections:", error);
      }
    };

    loadCollections();
  }, [getAccessTokenSilently]);

  // Example of using setVisibilityStates
  useEffect(() => {
    // You can set visibility states based on your logic here
    setVisibilityStates((prev) => ({
      ...prev,
      isReportsOverviewVisible: true, // Set based on your conditions
      isReportsListVisible: reports.length > 0, // Show list if reports are available
    }));
  }, [reports]); // Update visibility states when reports change

  // Add a function to start the tour
  const startTour = () => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    }
  };

  // Start the tour when the component mounts
  useEffect(() => {
    // Start the tour when the component mounts
    startTour(); // Call startTour here
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } reports`}
    >
      <h1 className="mb-8 text-3xl font-bold">User Performance Reports</h1>
      <p>View detailed reports of user performance after each session.</p>
      {isLoading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="reports-overview">
          <h2>Reports Overview</h2>
          <ul>
            {reports.map((report) => (
              <li key={report.report_id}>
                <p>Total Items: {report.total_items}</p>
                <p>Time Taken: {report.time_taken} seconds</p>
                <p>Missed Items: {report.missed_items}</p>
                <p>Skipped Items: {report.skipped_items}</p>
                <p>
                  Created At: {new Date(report.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <h2>Your Collections</h2>
          <ul>
            {collections.map((collection) => (
              <li key={collection.collection_id}>
                {collection.name} - Completed: {getCompletionCount(collection)}{" "}
                times
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add the GuidedTour component here */}
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete} // Use the new handler
        currentStep={currentTourStep}
        onStepChange={(step) => setCurrentTourStep(step)}
        tourName="reports"
      />
    </div>
  );
};

// Helper function to get completion count for a collection
const getCompletionCount = (collection: Collection): number => {
  // Use the collection name to demonstrate usage
  console.log(`Getting completion count for collection: ${collection.name}`);
  return Math.floor(Math.random() * 10); // Example: random count for demonstration
};

export default Reports;
