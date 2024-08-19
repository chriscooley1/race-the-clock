import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LandingPage.css";
import "../../App.css";

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="landing-page">
      <h1>Welcome to the Letter Reader App</h1>
      <button type="button" onClick={() => loginWithRedirect({ appState: { returnTo: '/signup' } })}>
        Register
      </button>
      <button type="button" onClick={() => loginWithRedirect()}>
        Already Registered
      </button>
    </div>
  );
};

export default LandingPage;
