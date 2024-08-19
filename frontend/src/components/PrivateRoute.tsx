import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
    return null; // Don't render anything while redirecting
  }

  return element;
};

export default PrivateRoute;
