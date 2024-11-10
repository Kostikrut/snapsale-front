import { useState } from "react";

import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/ForgotPassword.css";

const apiUrl = config.API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitEmail = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.status !== "success")
        return renderToast(
          "error",
          "Could'nt create reset link. Please check your email and try again."
        );

      return setMessage(data.message);
    } catch (err) {
      renderToast(
        err.message || "Something went wrong, please try again later."
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!message ? (
        <div>
          <p>
            Enter your email address, and we’ll send you a password reset link.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-password-input"
          />
          <button
            onClick={handleSubmitEmail}
            className="forgot-password-button"
          >
            Send Reset Link
          </button>
        </div>
      ) : (
        <p className="forgot-password-message">{message}</p>
      )}
    </div>
  );
}

export default ForgotPassword;
