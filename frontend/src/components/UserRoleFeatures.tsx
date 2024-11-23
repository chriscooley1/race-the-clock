import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserRoleFeaturesProps {
  role: string;
}

const UserRoleFeatures: React.FC<UserRoleFeaturesProps> = ({ role }) => {
  const { user } = useAuth0();
  const [currentRole, setCurrentRole] = useState<string>(
    localStorage.getItem("userRole") || role,
  );

  useEffect(() => {
    if (role !== currentRole) {
      setCurrentRole(role);
    }
  }, [role]);

  useEffect(() => {
    if (user) {
      console.log(
        "UserRoleFeatures component rendered. Current role:",
        currentRole,
      );
    }
  }, [user, currentRole]);

  return (
    <div className="mt-6 border-t pt-6">
      {user ? (
        <>
          <h3 className="mb-4 text-xl font-semibold">
            {currentRole === "teacher"
              ? "Teacher Features"
              : "Student Features"}
          </h3>
          {currentRole === "teacher" && (
            <div className="space-y-2">
              <p>• Create and manage custom collections</p>
              <p>• Track student progress</p>
              <p>• Set custom learning paths</p>
              <p>• Share collections with other teachers</p>
            </div>
          )}
          {currentRole === "student" && (
            <div className="space-y-2">
              <p>• Practice with assigned collections</p>
              <p>• Track your learning progress</p>
              <p>• Earn achievements and badges</p>
              <p>• Join classroom activities</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to see your features.</p>
      )}
    </div>
  );
};

export default UserRoleFeatures;
