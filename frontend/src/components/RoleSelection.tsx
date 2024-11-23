import React, { useEffect } from "react";

interface RoleSelectionProps {
  onRoleChange: (newRole: string) => Promise<void>;
  initialRole?: string;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  onRoleChange,
  initialRole = "student",
}) => {
  const [role, setRole] = React.useState<string>(
    localStorage.getItem("userRole") || initialRole,
  );

  useEffect(() => {
    if (initialRole && initialRole !== role) {
      setRole(initialRole);
      localStorage.setItem("userRole", initialRole);
    }
  }, [initialRole]);

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    await onRoleChange(newRole);
  };

  return (
    <div>
      <div className="mb-4 text-center">
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
