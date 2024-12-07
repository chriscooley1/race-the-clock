import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateDisplayName } from "../api";
import { useTheme } from "../context/ThemeContext";

interface UpdateDisplayNameFormProps {
  className?: string;
  style?: React.CSSProperties;
  onDisplayNameUpdate?: (newDisplayName: string) => void;
}

const UpdateDisplayNameForm: React.FC<UpdateDisplayNameFormProps> = ({
  className,
  style,
  onDisplayNameUpdate,
}) => {
  const [displayName, setDisplayName] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateDisplayName = async () => {
    try {
      await updateDisplayName(
        { display_name: displayName },
        getAccessTokenSilently,
      );
      alert("Display name updated successfully");
      if (onDisplayNameUpdate) {
        onDisplayNameUpdate(displayName);
      }
      setDisplayName("");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  const { theme } = useTheme();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUpdateDisplayName();
    }
  };

  return (
    <div
      className={`update-display-name-form mt-5 flex w-full flex-col items-center ${className}`}
      style={style}
    >
      <div className="flex w-full max-w-[300px] flex-col items-center">
        <input
          type="text"
          className="font-teacher mb-4 w-full rounded-md border border-black p-2 text-center text-base"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
          style={{
            backgroundColor: theme.isDarkMode ? "#1F1F1F" : "#FFFFFF",
            color: theme.isDarkMode ? "#FFFFFF" : "#000000",
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter your display name"
        />
        <button
          type="button"
          className="cursor-pointer rounded-md border border-none border-black bg-blue-600 px-5 py-3 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95 active:bg-blue-800"
          onClick={handleUpdateDisplayName}
        >
          Update Display Name
        </button>
      </div>
    </div>
  );
};

export default UpdateDisplayNameForm;
