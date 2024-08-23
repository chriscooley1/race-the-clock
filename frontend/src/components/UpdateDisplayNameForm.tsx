import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateDisplayName } from "../api"; // Make sure this function is correctly implemented

const UpdateDisplayNameForm: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateDisplayName = async () => {
    try {
      // Wrap displayName in an object with the correct key
      await updateDisplayName({ display_name: displayName }, getAccessTokenSilently);
      alert("Display name updated successfully");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your display name"
      />
      <button type="button" onClick={handleUpdateDisplayName}>
        Update Display Name
      </button>
    </div>
  );
};

export default UpdateDisplayNameForm;
