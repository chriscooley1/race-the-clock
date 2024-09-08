import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [isRedirecting, setIsRedirecting] = useState(false); // Track redirection state

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isRedirecting) {
      console.log("User not authenticated. Redirecting to login.");
      setIsRedirecting(true); // Prevent multiple redirects
      loginWithRedirect(); // Trigger redirect
    }
  }, [isAuthenticated, isLoading, isRedirecting, loginWithRedirect]);

  if (isLoading || isRedirecting) {
    // Show a loading spinner while checking auth or redirecting
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, we return null since the user is being redirected
    return null;
  }

  // Render the protected component once the user is authenticated
  return element;
};

export default PrivateRoute;
