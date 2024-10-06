import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser } from "../api";
import UpdateDisplayNameForm from "../components/UpdateDisplayNameForm";
import { useTheme } from "../context/ThemeContext";

interface UserData {
  display_name?: string;
  email?: string;
}

const MyAccount: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        setUserData(userProfile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-4 py-8 ${theme.isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <div className={`w-full max-w-md rounded-lg p-6 shadow-md ${theme.isDarkMode ? "bg-gray-700" : "bg-white"}`}>
        <h1 className="mb-6 text-center text-2xl font-bold">My Account</h1>
        {user ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="mb-4 size-24 rounded-full"
              />
              <h2 className="text-xl font-semibold">{userData?.display_name || user.name}</h2>
              <p className={`${theme.isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{user.email}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <p className={`text-sm ${theme.isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Email: {user.email}</p>
              <p className={`text-sm ${theme.isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Email Verified: {user.email_verified ? "Yes" : "No"}
              </p>
            </div>
            <UpdateDisplayNameForm />
          </div>
        ) : (
          <p className="text-center">Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
