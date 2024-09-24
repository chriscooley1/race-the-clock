import React, { useEffect, useState } from "react";
import "./MyAccount.css";
import "../../App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser } from "../../api"; // Import the function to get user data
import UpdateDisplayNameForm from "../../components/UpdateDisplayNameForm/UpdateDisplayNameForm"; // Import the form

interface UserData {
  display_name?: string;
  email?: string;
}

const MyAccount: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const userProfile = await getCurrentUser(getAccessTokenSilently);
        console.log("Fetched user profile:", userProfile);
        setUserData(userProfile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  return (
    <div className="my-account-container">
      <h2 className="my-account-heading">My Account</h2>
      {userData ? (
        <>
          <p className="my-account-info"><strong>Name:</strong> {userData.display_name || user?.name}</p>
          <p className="my-account-info"><strong>Email:</strong> {userData.email || user?.email}</p>
          
          {/* Add the form here */}
          <h3>Update Display Name</h3>
          <UpdateDisplayNameForm />

        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyAccount;
