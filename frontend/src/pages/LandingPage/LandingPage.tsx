import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LandingPage.css";
import "../../App.css";

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    console.log("Signup button clicked");
    loginWithRedirect({
      screen_hint: "signup",
      appState: { returnTo: "/your-collections" },
    } as any);
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    loginWithRedirect({
      appState: { returnTo: "/your-collections" },
    });
  };

  return (
    <div className="landing-page">
      <h1>Welcome to the Letter Reader App</h1>
      <button type="button" onClick={handleSignup}>
        Register
      </button>
      <button type="button" onClick={handleLogin}>
        Already Registered
      </button>
    </div>
  );
};

export default LandingPage;
