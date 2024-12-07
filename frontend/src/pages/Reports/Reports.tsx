import React, { useEffect, useState } from "react";
import { fetchReports, fetchCollections, fetchCompletionCounts } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { tourStepsReports } from "./tourStepsReports";
import GuidedTour from "../../components/GuidedTour";
import { AxiosError } from "axios";

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
  completion_count?: number;
}

const Reports: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [reports, setReports] = useState<Report[]>([]); // State to hold reports
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [collections, setCollections] = useState<Collection[]>([]); // State to hold collections
  const [completionCounts, setCompletionCounts] = useState<Record<number, number>>({});

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  // Define the steps variable without visibility states
  const steps = tourStepsReports(); // Create tour steps without visibility states

  useEffect(() => {
    const loadReports = async () => {
      try {
        const fetchedReports = await fetchReports(getAccessTokenSilently);
        setReports(fetchedReports);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Failed to load reports - Status:",
            error.response?.status,
          );
        } else {
          console.error("Error loading reports");
        }
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
        
        // Fetch completion counts for all collections
        const counts = await fetchCompletionCounts(getAccessTokenSilently);
        setCompletionCounts(counts);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Failed to load collections - Status:",
            error.response?.status,
          );
        } else {
          console.error("Error loading collections");
        }
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

  // Update the getCompletionCount function to use actual data
  const getCompletionCount = (collection: Collection): number => {
    return completionCounts[collection.collection_id] || 0;
  };

  return (
    <div className="page-container">
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

export default Reports;
