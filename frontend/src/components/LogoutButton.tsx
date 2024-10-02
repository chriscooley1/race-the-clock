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
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
