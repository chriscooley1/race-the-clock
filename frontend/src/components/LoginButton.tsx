import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect(); // Only initiate login
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
