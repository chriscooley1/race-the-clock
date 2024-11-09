import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser } from "../../api";
import UpdateDisplayNameForm from "../../components/UpdateDisplayNameForm";
import { useTheme } from "../../context/ThemeContext";
import { tourStepsMyAccount } from "./tourStepsMyAccount";
import GuidedTour from "../../components/GuidedTour";
import { updateUserRole } from "../../api"; // Assume you have an API function to update user role
import RoleSelection from "../../components/RoleSelection";
import UserRoleFeatures from "../../components/UserRoleFeatures";

interface UserData {
  display_name?: string;
  email?: string;
  role?: string; // Add role to UserData interface
}

const MyAccount: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { theme } = useTheme();

  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [role, setRole] = useState<string>("student"); // Default role

  // Define the steps variable without visibility states
  const steps = tourStepsMyAccount(); // Create tour steps without visibility states

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        setUserData(userProfile);
        // Check if the tour has already been completed
        const tourCompleted = localStorage.getItem("tourCompleted");
        if (!tourCompleted) {
          startTour(); // Call startTour if the tour hasn't been completed
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  const startTour = () => {
    if (steps.length > 0) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    } else {
      console.warn("No steps available for the tour.");
    }
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  const handleRoleChange = async (newRole: string) => {
    console.log("Changing role to:", newRole);
    if (user && user.sub) {
      const token = await getAccessTokenSilently();
      try {
        const updatedUser = await updateUserRole(user.sub, newRole, token);
        console.log("Role updated successfully:", updatedUser);
        setRole(newRole); // Update the local state
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center px-4 py-8 ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"} my-account`}
      style={{ color: theme.originalTextColor }}
    >
      <div
        className={`w-full max-w-md rounded-lg p-16 shadow-md ${theme.isDarkMode ? "bg-gray-700" : "bg-white"}`}
      >
        <h1 className="mb-6 text-center text-3xl font-bold">My Account</h1>

        {user ? (
          <div className="space-y-4">
            <div className="user-profile flex flex-col items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="mb-4 size-24 rounded-full"
              />
              <h2 className="text-xl font-semibold">
                {userData?.display_name || user.name}
              </h2>
              <p
                className={`${theme.isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {user.email}
              </p>
            </div>
            <UpdateDisplayNameForm className="update-display-name-form mb-4" />
            <div className="flex justify-center">
              <RoleSelection onRoleChange={handleRoleChange} />
            </div>
          </div>
        ) : (
          <p className="text-center">Loading user information...</p>
        )}
        <UserRoleFeatures role={role} />
      </div>
      <GuidedTour
        steps={steps}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
        tourName="myAccount"
      />
    </div>
  );
};

export default MyAccount;
