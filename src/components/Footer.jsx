import React from "react";
import "../pages/styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            At SnapSale Market, we are dedicated to providing the latest
            electronics at unbeatable prices. From smartphones to sound systems,
            we offer a wide range of high-quality tech products. Our mission is
            to ensure a seamless and enjoyable shopping experience for all tech
            enthusiasts.
          </p>
        </div>

        {/* Customer Support */}
        <div className="footer-section">
          <h4>Customer Support</h4>
          <ul>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/shipping">Shipping & Delivery</a>
            </li>
            <li>
              <a href="/returns">Returns</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="footer-section">
          <h4>We Accept</h4>
          <img src="/images/payment-methods.png" alt="Payment Methods" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} SnapSale Market. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
