import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Callback: React.FC = () => {
  const { handleRedirectCallback, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const handleAuth = async () => {
      await handleRedirectCallback();
      // Fetch data after successful login
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/namelists/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched data:", response.data);
        // Optionally redirect to a specific page after handling the callback
        window.location.replace("/your-collections");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    handleAuth();
  }, [handleRedirectCallback, getAccessTokenSilently]);

  return <div>Loading...</div>; // Show a loading indicator while processing
};

export default Callback;
