import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../../context/ThemeContext";
import FeedbackForm from "../../components/FeedbackForm";

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const { theme } = useTheme();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSignup = () => {
    console.log("Signup button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({
      appState: { returnTo: "/your-collections", isSignup: true },
    });
  };

  const handleLogin = () => {
    console.log("Login button clicked");
    try {
      localStorage.setItem("preLoginPath", window.location.pathname);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    loginWithRedirect({ appState: { returnTo: "/your-collections" } });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center p-5 text-center ${theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"} mt-4`}
      style={{ color: theme.originalTextColor }}
    >
      <h1 className="mb-5 box-border text-xl sm:text-2xl md:text-3xl">
        Welcome to Race The Clock
      </h1>
      <div className="w-full max-w-xs">
        <button
          type="button"
          onClick={handleSignup}
          className="register-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue mb-2.5 w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
        >
          Register
        </button>
        <button
          type="button"
          onClick={handleLogin}
          className="already-registered-button bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue w-full cursor-pointer rounded border border-gray-300 py-2.5 text-sm font-bold uppercase text-black hover:scale-105 active:scale-95 sm:text-base"
        >
          Already Registered
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Give Feedback
      </button>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
    </div>
  );
};

export default LandingPage;
