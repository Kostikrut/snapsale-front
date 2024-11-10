import React, { useContext, useState } from "react";

import { LoginContext } from "../contexts/LoginContext";

import "../pages/styles/SignUpBox.css";

const SignUpBox = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [address, setAddress] = useState({});
  const [error, setError] = useState(null);
  const { signUp } = useContext(LoginContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    signUp({
      fullName,
      email,
      phone,
      password,
      passwordConfirm,
      address,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = { ...address, [name]: value.toLowerCase() };
    setAddress(updatedAddress);
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <h2>Address</h2>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            onChange={handleAddressChange}
            required
            name="city"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            onChange={handleAddressChange}
            required
            name="address"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="apartment">Apartment, Suit atc...</label>
          <input
            onChange={handleAddressChange}
            required
            name="apartment"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">ZIP/Postal Code</label>
          <input
            onChange={handleAddressChange}
            required
            name="zipCode"
            type="text"
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpBox;
