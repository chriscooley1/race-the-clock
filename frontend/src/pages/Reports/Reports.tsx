import React from "react";
import { useTheme } from "../../context/ThemeContext";
import ReportsOverview from "../../components/ReportsOverview"; // Import the reports overview component

const Reports: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Reports</h1>
      <p>
        Reports: After each session, a report will show the user's performance,
        including total items shown, time taken, missed items, and skipped
        items. These reports could help teachers monitor student progress and
        adjust accordingly.
      </p>
      <p>
        Just like the Session Reports feature, but I want to make it so that you
        have the ability to attach these reports to individual IDs. I want it
        to be added to names that you choose, even though it's not the person
        signed in. That way teachers can track individual students' progress.
      </p>
      <ReportsOverview /> {/* Add the reports overview component here */}
    </div>
  );
};

export default Reports;
