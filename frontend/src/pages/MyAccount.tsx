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
    <div
      className={`fixed left-[250px] h-screen w-full p-3 ${theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <h2 className="mb-4 text-2xl md:text-3xl">My Account</h2>
      {userData ? (
        <>
          <p className="my-2.5 text-base md:text-lg">
            <strong>Name:</strong> {userData.display_name || user?.name}
          </p>
          <p className="my-2.5 text-base md:text-lg">
            <strong>Email:</strong> {userData.email || user?.email}
          </p>

          <h3 className="mb-3 mt-6 text-xl">Update Display Name</h3>
          <UpdateDisplayNameForm />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyAccount;
