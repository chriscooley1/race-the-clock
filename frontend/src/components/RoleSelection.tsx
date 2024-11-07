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
      <div className="text-center mb-4">
        <h2>Select Your Role</h2>
      </div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            value="teacher"
            checked={role === "teacher"}
            onChange={() => handleRoleChange("teacher")}
          />
          <span className="ml-2">Teacher</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="student"
            checked={role === "student"}
            onChange={() => handleRoleChange("student")}
          />
          <span className="ml-2">Student</span>
        </label>
      </div>
    </div>
  );
};

export default RoleSelection;
