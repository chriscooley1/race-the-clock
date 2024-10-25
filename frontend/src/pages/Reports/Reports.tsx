import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { fetchReports } from "../../api";
import { useAuth0 } from "@auth0/auth0-react";

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

const Reports: React.FC = () => {
  const { theme } = useTheme();
  const { getAccessTokenSilently } = useAuth0();
  const [reports, setReports] = useState<Report[]>([]); // State to hold reports
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

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
        </div>
      )}
      {/* Add your report logic and UI here */}
    </div>
  );
};

export default Reports;
