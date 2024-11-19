import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchReports, fetchCollections } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { tourStepsReports } from "./tourStepsReports";
import GuidedTour from "../../components/GuidedTour";
import FeedbackForm from "../../components/FeedbackForm";

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

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // Define the steps variable without visibility states
  const steps = tourStepsReports(); // Create tour steps without visibility states

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
    startTour(); // Call startTour here
  }, []);

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      } reports mt-4`}
      style={{ color: theme.originalTextColor }}
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
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="bg-light-blue mt-4 rounded px-4 py-2 text-white"
      >
        Give Feedback
      </button>

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}

      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={(step) => setCurrentTourStep(step)}
        tourName="reports"
      />
    </div>
  );
};

// Helper function to get completion count for a collection
const getCompletionCount = (collection: Collection): number => {
  console.log(`Getting completion count for collection: ${collection.name}`);
  return Math.floor(Math.random() * 10); // Example: random count for demonstration
};

export default Reports;
