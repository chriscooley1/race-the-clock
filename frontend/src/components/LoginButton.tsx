import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => {
        console.log("Login button clicked.");
        loginWithRedirect();
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Log In
    </button>
  );
};

export default LoginButton;
