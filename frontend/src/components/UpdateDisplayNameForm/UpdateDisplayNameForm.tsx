import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateDisplayName } from "../../api"; // Make sure this function is correctly implemented
import "./UpdateDisplayNameForm.css";

const UpdateDisplayNameForm: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateDisplayName = async () => {
    try {
      await updateDisplayName({ display_name: displayName }, getAccessTokenSilently);
      alert("Display name updated successfully");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  return (
    <div className="update-display-name-form">
      <input
        type="text"
        className="update-display-name-input"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your display name"
      />
      <button
        type="button"
        className="update-display-name-button"
        onClick={handleUpdateDisplayName}
      >
        Update Display Name
      </button>
    </div>
  );
};

export default UpdateDisplayNameForm;
