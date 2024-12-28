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

        {/* Payment Methods */}
        <div className="footer-section">
          <h4>We Accept</h4>
          <div className="payment-options">
            <div className="payment-method">
              <i className="fab fa-cc-visa"></i>
              <span>Visa</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-cc-mastercard"></i>
              <span>MasterCard</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-cc-amex"></i>
              <span>American Express</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-cc-discover"></i>
              <span>Discover</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-cc-paypal"></i>
              <span>PayPal</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-google-pay"></i>
              <span>Google Pay</span>
            </div>
            <div className="payment-method">
              <i className="fab fa-apple-pay"></i>
              <span>Apple Pay</span>
            </div>
          </div>
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
