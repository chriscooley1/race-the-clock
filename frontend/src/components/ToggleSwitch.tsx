import React from "react";

interface ToggleSwitchProps {
  role: string;
  onChange: (role: string) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ role, onChange }) => {
  const handleChange = (newRole: string) => {
    console.log("Role selected:", newRole);
    onChange(newRole);
  };

  return (
    <div className="flex items-center mb-4">
      <label className="mr-4">
        <input
          type="radio"
          value="teacher"
          checked={role === "teacher"}
          onChange={() => handleChange("teacher")}
        />
        Teacher
      </label>
      <label>
        <input
          type="radio"
          value="student"
          checked={role === "student"}
          onChange={() => handleChange("student")}
        />
        Student
      </label>
    </div>
  );
};

export default ToggleSwitch;
