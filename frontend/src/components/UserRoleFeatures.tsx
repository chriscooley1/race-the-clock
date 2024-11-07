import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserRoleFeaturesProps {
  role: string; // Accept role as a prop
}

const UserRoleFeatures: React.FC<UserRoleFeaturesProps> = ({ role }) => {
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      console.log("UserRoleFeatures component rendered. Current user:", user);
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <>
          {role === "teacher" && (
            <div className="flex justify-center">
              <div>
                <h2>Teacher Features</h2>
                {/* Render teacher-specific features */}
              </div>
            </div>
          )}
          {role === "student" && (
            <div className="flex justify-center">
              <div>
                <h2>Student Features</h2>
                {/* Render student-specific features */}
              </div>
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
