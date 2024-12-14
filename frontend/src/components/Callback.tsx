import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Callback: React.FC = () => {
  const { handleRedirectCallback } = useAuth0();

  useEffect(() => {
    const handleAuth = async () => {
      await handleRedirectCallback();
      // Optionally redirect to a specific page after handling the callback
      window.location.replace("/your-collections");
    };

    handleAuth();
  }, [handleRedirectCallback]);

  return <div>Loading...</div>; // Show a loading indicator while processing
};

export default Callback;
