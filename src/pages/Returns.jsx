import React from "react";

import "./styles/Returns.css";

const ReturnsPage = () => {
  return (
    <div className="returns-page">
      <h1>Returns & Refunds</h1>
      <p>
        At SnapSale Market, we strive to ensure customer satisfaction. If you
        encounter any issues with your purchase and wish to request a return,
        please follow the instructions below.
      </p>

      <h2>How to Request a Return</h2>
      <p>
        To request a return, kindly email our Returns Support team at{" "}
        <a href="mailto:returns@snapsalemarket.com">
          returns@snapsalemarket.com
        </a>
        . Please include the following information in your email:
      </p>

      <ul className="returns-list">
        <li>
          <strong>Full Name:</strong> Your name as it appears on the order.
        </li>
        <li>
          <strong>Phone Number:</strong> A phone number where we can reach you
          for further assistance.
        </li>
        <li>
          <strong>Invoice ID:</strong> The invoice ID for the purchase you wish
          to return.
        </li>
        <li>
          <strong>Issue Description:</strong> A brief explanation of the problem
          you encountered with the product.
        </li>
      </ul>

      <h2>What to Expect Next</h2>
      <p>
        Once we receive your email, our team will review your request and
        respond within 2-3 business days. If your return is approved, we will
        provide you with a return label and instructions for shipping the
        product back to us.
      </p>

      <p>
        For more details on our return policy, please refer to our{" "}
        <a href="/faq">FAQ page</a> or contact our support team directly.
      </p>
    </div>
  );
};

export default ReturnsPage;
