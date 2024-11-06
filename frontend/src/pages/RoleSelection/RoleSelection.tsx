import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserRole } from "../../api"; // Ensure this is correctly exported

const RoleSelection: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState<string>("student"); // Default role

  const handleRoleChange = async () => {
    if (user && user.sub) { // Check if user and user.sub are defined
      const token = await getAccessTokenSilently();
      await updateUserRole(user.sub, role, token); // Update user role in the backend
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <div>
      <h1>Select Your Role</h1>
      <div>
        <label>
          <input
            type="radio"
            value="teacher"
            checked={role === "teacher"}
            onChange={() => setRole("teacher")}
          />
          Teacher
        </label>
        <label>
          <input
            type="radio"
            value="student"
            checked={role === "student"}
            onChange={() => setRole("student")}
          />
          Student
        </label>
      </div>
      <button onClick={handleRoleChange}>Continue</button>
    </div>
  );
};

export default RoleSelection;
