import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "../App.css";
import { useAuth } from "../context/AuthContext/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      setToken(data.access_token);
      navigate("/your-collections"); // Use the relative path without the base
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <input
        type="text"
        className="custom-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        className="custom-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="button" onClick={handleLogin} className="styled-button">
        Login
      </button>
      <div className="link-container">
        <p>
          New user?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")} // Use the relative path without the base
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
