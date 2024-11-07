import React from "react";

interface RoleSelectionProps {
  onRoleChange: (newRole: string) => Promise<void>; // Accept the role change handler
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleChange }) => {
  const [role, setRole] = React.useState<string>("student"); // Default role

  const handleRoleChange = (newRole: string) => {
    setRole(newRole); // Update the local state
    onRoleChange(newRole); // Call the passed handler
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <div>
        <label>
          <input
            type="radio"
            value="teacher"
            checked={role === "teacher"}
            onChange={() => handleRoleChange("teacher")} // Call handleRoleChange with the new role
          />
          Teacher
        </label>
        <label>
          <input
            type="radio"
            value="student"
            checked={role === "student"}
            onChange={() => handleRoleChange("student")} // Call handleRoleChange with the new role
          />
          Student
        </label>
      </div>
      <button type="button" onClick={() => onRoleChange(role)}>Continue</button>
    </div>
  );
};

export default RoleSelection;
