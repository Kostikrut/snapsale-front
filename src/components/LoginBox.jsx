import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoginContext } from "../contexts/LoginContext";

import "../pages/styles/LoginBox.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useContext(LoginContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logIn(email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <Link to="/forgotPassword">
        <button className="forgot-pass-btn">Forgot Password</button>
      </Link>
    </div>
  );
};

export default LoginPage;
