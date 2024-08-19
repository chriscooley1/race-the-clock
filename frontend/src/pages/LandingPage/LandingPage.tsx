import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LandingPage.css";
import "../../App.css";

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    loginWithRedirect({
      screen_hint: "signup",
    } as any); // Using 'as any' to bypass TypeScript's type checking
  };

  return (
    <div className="landing-page">
      <h1>Welcome to the Letter Reader App</h1>
      <button type="button" onClick={handleSignup}>
        Register
      </button>
      <button type="button" onClick={() => loginWithRedirect()}>
        Already Registered
      </button>
    </div>
  );
};

export default LandingPage;
