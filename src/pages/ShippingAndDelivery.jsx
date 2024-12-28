import React from "react";

import "./styles/ShippingAndDelivery.css";

const ShippingAndDelivery = () => {
  return (
    <div className="shipping-page">
      <h1>Shipping & Delivery</h1>
      <p>
        At SnapSale Market, we are committed to ensuring a smooth and efficient
        delivery process. Once your order has been placed and payment has been
        successfully processed, we will provide you with all the necessary
        details to track your shipment.
      </p>

      <h2>What Happens After Payment?</h2>
      <p>
        After your invoice has been paid, you will receive a confirmation email
        from us containing:
      </p>
      <ul className="shipping-list">
        <li>
          <strong>Order Confirmation:</strong> A detailed summary of your order,
          including itemized products and payment details.
        </li>
        <li>
          <strong>Shipping Instructions:</strong> Guidelines on how to track and
          receive your package.
        </li>
        <li>
          <strong>Tracking Details:</strong> A tracking number and link to the
          courier service’s website to monitor your shipment’s progress in real
          time.
        </li>
      </ul>

      <h2>Delivery Timeframes</h2>
      <p>
        Delivery times depend on your location and the shipping method selected
        during checkout. Estimated delivery times will be provided in your
        confirmation email.
      </p>

      <h2>Additional Information</h2>
      <p>
        If you do not receive your confirmation email within 24 hours of
        payment, please check your spam or junk folder. If it is not there, feel
        free to contact our support team at{" "}
        <a href="mailto:support@snapsalemarket.com">
          support@snapsalemarket.com
        </a>
        .
      </p>
      <p>
        For more information or assistance, visit our{" "}
        <a href="/faq">FAQ page</a> or contact us directly.
      </p>
    </div>
  );
};

export default ShippingAndDelivery;
