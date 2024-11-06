import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserRoleFeatures: React.FC = () => {
  const { user } = useAuth0();

  useEffect(() => {
    console.log("UserRoleFeatures component rendered. Current user:", user);
  }, [user]);

  return (
    <div>
      {user ? (
        <>
          {user.role === "teacher" && (
            <div>
              <h2>Teacher Features</h2>
              {/* Render teacher-specific features */}
            </div>
          )}
          {user.role === "student" && (
            <div>
              <h2>Student Features</h2>
              {/* Render student-specific features */}
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
