import React, { useState } from "react";

import "./styles/ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you shortly.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>
        Have questions or need assistance? Our team is here to help! Reach out
        to us via the form below or through one of our alternative contact
        methods.
      </p>

      <div className="contact-container">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Alternative Contact Methods</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@snapsalemarket.com">
              support@snapsalemarket.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong> +1 (800) 123-4567
          </p>
          <p>
            <strong>Office Hours:</strong> Monday - Friday, 9 AM - 5 PM
          </p>
          <p>
            For immediate assistance, please refer to our{" "}
            <a href="/faq">FAQ page</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
