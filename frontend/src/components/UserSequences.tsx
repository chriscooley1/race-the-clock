import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSequences } from "../api";

const UserSequences: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const fetchData = async () => {
    try {
      if (user?.sub) {
        const sequences = await getSequences(user.sub, getAccessTokenSilently);
        console.log(sequences);
      }
    } catch (error) {
      console.error("Error fetching sequences", error);
    }
  };

  React.useEffect(() => {
    if (user?.sub) {
      fetchData();
    }
  }, [getAccessTokenSilently, user?.sub]); // Add dependencies

  return <div>User Sequences</div>;
};

export default UserSequences;
