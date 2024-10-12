import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWithHistoryProps {
  children: React.ReactNode;
}

const Auth0ProviderWithHistory: React.FC<Auth0ProviderWithHistoryProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  interface AppState {
    returnTo?: string;
  }

  const onRedirectCallback = (appState?: AppState) => {
    let redirectTo =
      appState?.returnTo ||
      localStorage.getItem("preLoginPath") ||
      "/your-collections";

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
      "/my-account",
      "/games",
      "/timed-challenges",
      "/reports",
      "/badges-achievements",
    ];

    if (!validRoutes.includes(redirectTo)) {
      redirectTo = "/";
    }

    navigate(redirectTo);
    localStorage.removeItem("preLoginPath");
  };

  return (
    <Auth0Provider
      domain={
        import.meta.env.VITE_AUTH0_DOMAIN || "dev-kooql0161qbynbss.us.auth0.com"
      }
      clientId={
        import.meta.env.VITE_AUTH0_CLIENT_ID ||
        "ujXLWixZB1n2MQwqHiSRNMQMMGMOD7bQ"
      }
      authorizationParams={{
        redirect_uri:
          import.meta.env.VITE_AUTH0_CALLBACK_URL ||
          "https://race-the-clock-frontend-production.up.railway.app/callback",
        audience:
          import.meta.env.VITE_AUTH0_AUDIENCE ||
          "https://dev-kooql0161qbynbss.us.auth0.com/api/v2/",
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
