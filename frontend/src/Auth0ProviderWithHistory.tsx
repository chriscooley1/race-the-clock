import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWithHistoryProps {
  children: React.ReactNode;
}

const Auth0ProviderWithHistory: React.FC<Auth0ProviderWithHistoryProps> = ({ children }) => {
  const navigate = useNavigate();

  const isDevelopment = import.meta.env.MODE === 'development';

  console.log("Environment:", import.meta.env.MODE);
  console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
  console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log("Auth0 Callback URL:", import.meta.env.VITE_AUTH0_CALLBACK_URL);
  console.log("Auth0 Audience:", import.meta.env.VITE_AUTH0_AUDIENCE);
  console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

  const onRedirectCallback = (appState?: any) => {
    let redirectTo = appState?.returnTo || localStorage.getItem("preLoginPath") || "/your-collections";
  
    // Check if the redirectTo path is valid
    const validRoutes = [
      "/your-collections",
      "/new-collection",
      "/discover-collections",
      "/fullscreen-display",
      "/collection-setup",
      "/collection-final-step",
      "/name-generator",
      "/resources",
      "/settings",
      "/my-account"
    ];
  
    if (!validRoutes.includes(redirectTo)) {
      redirectTo = "/";
    }
  
    navigate(redirectTo);
    localStorage.removeItem("preLoginPath");
  };

  const callbackUrl = isDevelopment
    ? 'http://localhost:5173/callback'
    : import.meta.env.VITE_AUTH0_CALLBACK_URL || 'https://race-the-clock-frontend-production.up.railway.app/callback';

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: callbackUrl,
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
