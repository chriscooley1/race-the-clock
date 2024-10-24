import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const LoginButton = () => {
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/namelists/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = async () => {
    console.log("Login button clicked.");
    await loginWithRedirect();
    await fetchData(); // Call fetchData after login
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
    >
      Log In
    </button>
  );
};

export default LoginButton;
