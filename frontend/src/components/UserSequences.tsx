import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSequences } from "../api";

const UserSequences: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const fetchData = useCallback(async () => {
    try {
      if (user?.sub) {
        console.log("Fetching user sequences");
        await getSequences(user.sub, getAccessTokenSilently);
        console.log("Sequences fetched successfully");
      }
    } catch {
      console.error("Error fetching sequences");
    }
  }, [getAccessTokenSilently, user?.sub]);

  React.useEffect(() => {
    fetchData();
  }, [getAccessTokenSilently, user?.sub, fetchData]); // Add fetchData to dependencies

  return <div>User Sequences</div>;
};

export default UserSequences;
