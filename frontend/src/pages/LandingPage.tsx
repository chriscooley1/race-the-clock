import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../context/ThemeContext";

// Define a custom type that includes screen_hint and appState
interface CustomRedirectLoginOptions {
  screen_hint?: string;
  appState?: {
    returnTo?: string;
  };
}

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const { theme } = useTheme();

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
    <div
      className={`box-border flex min-h-screen w-full flex-col items-center justify-center p-5 text-center ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"}`}
    >
      <h1 className="mb-5 text-xl sm:text-2xl md:text-3xl">
        Welcome to Race The Clock
      </h1>
      <div className="w-full max-w-xs">
        <button
          type="button"
          onClick={handleSignup}
          className="bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue mb-2.5 w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
        >
          Register
        </button>
        <button
          type="button"
          onClick={handleLogin}
          className="bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
        >
          Already Registered
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
