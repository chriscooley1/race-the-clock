import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWithHistoryProps {
  children: React.ReactNode;
}

const Auth0ProviderWithHistory: React.FC<Auth0ProviderWithHistoryProps> = ({ children }) => {
  const navigate = useNavigate();

  // Debug environment variables
  console.log('AUTH0_DOMAIN:', import.meta.env.VITE_AUTH0_DOMAIN);
  console.log('AUTH0_CLIENT_ID:', import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log('AUTH0_AUDIENCE:', import.meta.env.VITE_AUTH0_AUDIENCE);

  const onRedirectCallback = (appState?: any) => {
    navigate(appState?.returnTo || "/your-collections");
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
