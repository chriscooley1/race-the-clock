import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWithHistoryProps {
  children: React.ReactNode;
}

const Auth0ProviderWithHistory: React.FC<Auth0ProviderWithHistoryProps> = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: any) => {
    let redirectTo = appState?.returnTo || "/your-collections";
  
    // Fallback in case the route doesn't exist or fails
    if (!appState?.returnTo) {
      const storedPath = localStorage.getItem("preLoginPath");
      if (storedPath) {
        redirectTo = storedPath;
      }
    }
  
    // Double-check that the route is valid
    const validRoutes = ["/your-collections", "/new-collection", "/discover-collections"];
    if (!validRoutes.includes(redirectTo)) {
      redirectTo = "/"; // Default to home or some valid route
    }
  
    navigate(redirectTo);
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
