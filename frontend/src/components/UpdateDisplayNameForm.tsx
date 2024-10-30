import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateDisplayName } from "../api";

interface UpdateDisplayNameFormProps {
  className?: string; // Accept className as an optional prop
}

const UpdateDisplayNameForm: React.FC<UpdateDisplayNameFormProps> = ({
  className,
}) => {
  const [displayName, setDisplayName] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateDisplayName = async () => {
    try {
      console.log("Attempting to update display name:", displayName);
      await updateDisplayName(
        { display_name: displayName },
        getAccessTokenSilently,
      );
      alert("Display name updated successfully");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUpdateDisplayName();
    }
  };

  return (
    <div
      className={`update-display-name-form mt-5 flex w-full max-w-[300px] flex-col items-center ${className}`}
    >
      <input
        type="text"
        className="mb-4 w-full rounded-md border border-gray-300 p-2 font-['Caveat'] text-base"
        value={displayName}
        onChange={(e) => {
          console.log("Display name input changed:", e.target.value);
          setDisplayName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Enter your display name"
      />
      <button
        type="button"
        className="w-full cursor-pointer rounded-md border-none bg-blue-600 px-5 py-3 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95 active:bg-blue-800 md:w-auto"
        onClick={handleUpdateDisplayName}
      >
        Update Display Name
      </button>
    </div>
  );
};

export default UpdateDisplayNameForm;
