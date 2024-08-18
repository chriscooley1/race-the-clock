import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import "../App.css";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(username, password);
      navigate("/login"); // Navigate to login after successful registration
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
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
      <button type="button" onClick={handleRegister} className="styled-button">
        Register
      </button>
      <div className="link-container">
        <p>
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
