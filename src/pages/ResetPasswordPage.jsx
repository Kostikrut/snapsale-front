import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/ResetPasswordPage.css";

const apiUrl = config.API_URL;

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/resetPassword/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passwordConfirm: passwordConfirm, password }),
      });

      const data = await res.json();

      if (data.status !== "success") throw new Error(data);

      renderToast(
        "success",
        "Password reset successfully! Redirecting to login..."
      );
      setTimeout(() => navigate("/account"), 3000);
    } catch (err) {
      renderToast(
        "error",
        err.message || "Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword} className="reset-password-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
