import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  interface UserMetadata {
    key1: string;
    key2: number;
  }
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = import.meta.env.VITE_AUTH0_DOMAIN;

      try {
        console.log("Fetching user metadata...");
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user?.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();
        console.log("User metadata fetched:", user_metadata);
        setUserMetadata(user_metadata);
      } catch (e) {
        const error = e as Error;
        console.log("Error fetching user metadata:", error.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  return (
    isAuthenticated && (
      <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <img src={user?.picture} alt={user?.name} className="mx-auto mb-4 h-24 w-24 rounded-full" />
        <h2 className="mb-2 text-center text-2xl font-bold">{user?.name}</h2>
        <p className="text-gray-600 text-center mb-4">{user?.email}</p>
        <h3 className="text-xl font-semibold mb-2">User Metadata</h3>
        {userMetadata ? (
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          <p className="text-gray-600 italic">No user metadata defined</p>
        )}
      </div>
    )
  );
};

export default Profile;
