import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LandingPage.css";
import "../../App.css";

// Define a custom type that includes screen_hint and appState
interface CustomRedirectLoginOptions {
  screen_hint?: string;
  appState?: {
    returnTo?: string;
  };
}

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    console.log("Signup button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname); // Store current path before redirect
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    // Using the custom type
    const loginOptions: CustomRedirectLoginOptions = {
      screen_hint: "signup",
      appState: { returnTo: "/your-collections" },
    };
    loginWithRedirect(loginOptions);
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname); // Store current path before redirect
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    // Using the custom type
    const loginOptions: CustomRedirectLoginOptions = {
      appState: { returnTo: "/your-collections" },
    };
    loginWithRedirect(loginOptions);
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Race The Clock</h1>
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
