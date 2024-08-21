import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button type="button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin + "/letter-reader" } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;