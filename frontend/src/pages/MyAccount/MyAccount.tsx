import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser, updateDisplayName } from "../../api";
import UpdateDisplayNameForm from "../../components/UpdateDisplayNameForm";
import { tourStepsMyAccount } from "./tourStepsMyAccount";
import GuidedTour from "../../components/GuidedTour";
import { updateUserRole } from "../../api";
import RoleSelection from "../../components/RoleSelection";
import UserRoleFeatures from "../../components/UserRoleFeatures";
import BubbleText from "../../components/BubbleText";
import { useTheme } from "../../context/ThemeContext";

interface UserData {
  display_name?: string;
  email?: string;
  role?: string; // Add role to UserData interface
}

const MyAccount: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [role, setRole] = useState<string>(
    localStorage.getItem("userRole") || "student",
  );
  const { theme } = useTheme();

  // Define the steps variable without visibility states
  const steps = tourStepsMyAccount(); // Create tour steps without visibility states

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        // If no display_name is set, update it with the Auth0 name
        if (!userProfile.display_name && user?.name) {
          const displayName = user.name.includes("|")
            ? user.name.split("|")[1]
            : user.name;
          await updateDisplayName(
            { display_name: displayName },
            getAccessTokenSilently,
          );
          userProfile.display_name = displayName;
        }
        setUserData(userProfile);
        // Set initial role from user profile
        if (userProfile?.role) {
          setRole(userProfile.role);
        }
        // Check if the tour has already been completed
        const tourCompleted = localStorage.getItem("tourCompleted");
        if (!tourCompleted) {
          startTour();
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently, user?.name]);

  const startTour = () => {
    if (steps.length > 0) {
      setIsTourRunning(true);
      setCurrentTourStep(0); // Reset to the first step
    } else {
      console.warn("No steps available for the tour");
    }
  };

  const handleTourComplete = () => {
    console.log("Tour completed");
    setIsTourRunning(false); // Reset the tour running state
    localStorage.setItem("tourCompleted", "true"); // Mark the tour as completed
  };

  const handleRoleChange = async (newRole: string) => {
    console.log("Attempting role change");
    if (user && user.sub) {
      const token = await getAccessTokenSilently();
      try {
        const updatedUser = await updateUserRole(user.sub, newRole, token);
        console.log("Role updated successfully", updatedUser);
        setRole(newRole); // Update the local state
        localStorage.setItem("userRole", newRole);
      } catch (error) {
        console.error("Error updating role", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  const handleDisplayNameUpdate = (newDisplayName: string) => {
    setUserData((prevData) => ({
      ...prevData,
      display_name: newDisplayName,
    }));
  };

  const getTextColorForBackground = (bgColor: string) => {
    if (bgColor && theme.isDarkMode) {
      return "text-white";
    }
    return "text-black";
  };

  const getCardBackgroundColor = () => {
    if (theme.isDarkMode) {
      return "bg-gray-700";
    }
    if (theme.backgroundColor) {
      return "bg-white";
    }
    return "bg-white";
  };

  return (
    <div className="page-container">
      <div
        className={`rounded-lg border p-8 shadow-lg ${getCardBackgroundColor()} ${getTextColorForBackground(theme.backgroundColor)}`}
        style={{
          borderColor: theme.isDarkMode ? "rgb(75, 85, 99)" : "black",
        }}
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          <BubbleText>My Account</BubbleText>
        </h1>

        {user ? (
          <div className="space-y-4">
            <div className="user-profile flex flex-col items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="mb-4 size-24 rounded-full border border-black"
              />
              <h2 className="text-xl font-semibold">
                {userData?.display_name ||
                  (user?.name?.includes("|")
                    ? user.name.split("|")[1]
                    : user.name)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <UpdateDisplayNameForm
              className="update-display-name-form mb-4"
              onDisplayNameUpdate={handleDisplayNameUpdate}
            />
            <div className="flex justify-center">
              <RoleSelection
                onRoleChange={handleRoleChange}
                initialRole={userData?.role || role}
              />
            </div>
          </div>
        ) : (
          <p className="text-center">Loading user information...</p>
        )}
        <UserRoleFeatures role={role} />

        <GuidedTour
          steps={steps}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={setCurrentTourStep}
          tourName="myAccount"
        />
      </div>
    </div>
  );
};

export default MyAccount;
