import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateDisplayName } from "../../api";

const UpdateDisplayNameForm: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateDisplayName = async () => {
    try {
      console.log("Attempting to update display name:", displayName);
      await updateDisplayName({ display_name: displayName }, getAccessTokenSilently);
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
    <div className="flex flex-col items-center mt-5 w-full max-w-[300px]">
      <input
        type="text"
        className="w-full p-2 text-base rounded-md border border-gray-300 mb-4 font-['Caveat']"
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
        className="w-full md:w-auto bg-blue-600 text-white border-none py-3 px-5 rounded-md cursor-pointer text-base font-bold transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-800 active:scale-95"
        onClick={handleUpdateDisplayName}
      >
        Update Display Name
      </button>
    </div>
  );
};

export default UpdateDisplayNameForm;
