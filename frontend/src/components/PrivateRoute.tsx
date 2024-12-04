import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isRedirecting) {
      console.log("User not authenticated. Redirecting to login.");
      setIsRedirecting(true);
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, isRedirecting, loginWithRedirect]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-y-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return element;
};

export default PrivateRoute;
