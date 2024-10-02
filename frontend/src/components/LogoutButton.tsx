import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => {
        console.log("Logout button clicked.");
        logout({ logoutParams: { returnTo: window.location.origin } });
      }}
      className="rounded bg-red-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-red-700"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
