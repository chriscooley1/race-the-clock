import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    const loginOptions: CustomRedirectLoginOptions = {
      screen_hint: "signup",
      appState: { returnTo: "/your-collections" },
    };
    loginWithRedirect(loginOptions);
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    const loginOptions: CustomRedirectLoginOptions = {
      appState: { returnTo: "/your-collections" },
    };
    loginWithRedirect(loginOptions);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full text-center p-5 box-border">
      <h1 className="mb-5 text-2xl md:text-3xl">Welcome to Race The Clock</h1>
      <button
        type="button"
        onClick={handleSignup}
        className="mb-2.5 py-2.5 w-landing-button text-base bg-light-blue text-black border border-gray-300 rounded cursor-pointer uppercase font-bold transition-background-transform hover:bg-hover-blue hover:scale-105 active:bg-active-blue active:scale-95"
      >
        Register
      </button>
      <button
        type="button"
        onClick={handleLogin}
        className="mb-2.5 py-2.5 w-landing-button text-base bg-light-blue text-black border border-gray-300 rounded cursor-pointer uppercase font-bold transition-background-transform hover:bg-hover-blue hover:scale-105 active:bg-active-blue active:scale-95"
      >
        Already Registered
      </button>
    </div>
  );
};

export default LandingPage;
