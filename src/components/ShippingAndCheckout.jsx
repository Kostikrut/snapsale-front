import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "../pages/styles/ShippingAndCheckout.css";

const apiUrl = config.API_URL;

function ShippingAndCheckout() {
  const { bearerToken, userData } = useContext(LoginContext);
  const { invoiceId } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [isCouponValid, setIsCouponValid] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [shippingDetails, setShippingDetails] = useState({
    shippingType: "standard",
    address: {
      address: "",
      apartment: "",
      city: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (!userData?.address) {
      setUseSavedAddress(false);
    } else {
      setUseSavedAddress(true);
      setShippingDetails((prev) => ({
        ...prev,
        address: userData.address,
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.address) {
      setShippingDetails((prev) => ({
        ...prev,
        address: userData.address,
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (!bearerToken) return;

    const fetchInvoiceDetails = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/invoices/${invoiceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
        });

        const { data } = await res.json();

        if (!res.ok) throw data;

        setInvoiceDetails(data.data);
      } catch (err) {
        renderToast(
          "error",
          "Couldn't get invoice details, please try again later."
        );
      }
    };

    fetchInvoiceDetails();
  }, [bearerToken, invoiceId, shippingDetails]);

  const handleShippingTypeChange = (e) => {
    const newShippingType = e.target.value;
    setShippingDetails((prev) => ({
      ...prev,
      shippingType: newShippingType,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const validateCoupon = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          invoiceId: invoiceDetails._id,
        }),
      });

      const { valid } = await res.json();
      if (!res.ok) throw new Error("Invalid coupon code");

      setIsCouponValid(valid);
      renderToast("success", "Coupon applied successfully!");
    } catch (err) {
      setIsCouponValid(false);
      renderToast("error", err.message || "Invalid coupon code");
    }
  };

  const updateShippingDetails = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/invoices/${invoiceId}/updateAddressAndShipping`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ shippingDetails }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw data;

      proceedOrderAndPay();
    } catch (err) {
      renderToast(
        "error",
        err.message ||
          "Couldn't update shipping details, please try again later."
      );
    }
  };

  const proceedOrderAndPay = async () => {
    if (setIsCouponValid) {
      await applyCoupon();
    }

    try {
      const checkout = await fetch(
        `${apiUrl}/api/v1/invoices/${invoiceId}/createCheckoutSession`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const session = await checkout.json();

      console.log(session);
      if (!checkout.ok) throw session;

      window.location.href = session.sessionUrl;
    } catch (err) {
      console.log(
        err.message || "Couldn't proceed checkout, please try again later."
      );
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode,
          invoiceId: invoiceDetails._id,
        }),
      });

      const { data } = await res.json();

      if (!res.ok) throw data;
    } catch (err) {
      renderToast("error", err || "Couldn't apply coupon, try again.");
    }
  };

  return (
    <div className="shipping-checkout-container">
      <h2>Invoice Details</h2>
      {invoiceDetails ? (
        <div className="invoice-details">
          <p>Invoice ID: {invoiceDetails.id}</p>
          <p>
            Total: {invoiceDetails.totalPrice} {invoiceDetails.currency}
          </p>
          <p>Status: {invoiceDetails.status}</p>
          <p>Paid: {invoiceDetails.isPaid ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p>Loading invoice details...</p>
      )}

      <h3>Shipping Options</h3>
      <select
        value={shippingDetails.shippingType}
        onChange={handleShippingTypeChange}
      >
        <option value="standard">Standard Shipping</option>
        <option value="express">Express Shipping</option>
        <option value="store">Pickup from Store</option>
      </select>

      {(shippingDetails.shippingType === "standard" ||
        shippingDetails.shippingType === "express") && (
        <div className="address-selection">
          <h4>Shipping Address</h4>

          <label>
            <input
              type="radio"
              name="addressOption"
              checked={useSavedAddress}
              onChange={() => setUseSavedAddress(true)}
              disabled={!userData?.address}
            />
            <span className={userData?.address ? "" : "disabled-text"}>
              Use Saved Address
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="addressOption"
              checked={!useSavedAddress}
              onChange={() => setUseSavedAddress(false)}
            />
            Use New Address
          </label>

          {!useSavedAddress && (
            <div className="address-form">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingDetails.address.address}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="apartment"
                placeholder="Apartment"
                value={shippingDetails.address.apartment}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingDetails.address.city}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={shippingDetails.address.zipCode}
                onChange={handleAddressChange}
              />
            </div>
          )}
        </div>
      )}

      <div className="coupon-section">
        <h3>Apply Coupon</h3>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button className="validate-coupon-btn" onClick={validateCoupon}>
          Validate Coupon
        </button>
        {isCouponValid === true && <p className="success">Coupon is valid!</p>}
        {isCouponValid === false && (
          <p className="error">Invalid coupon code.</p>
        )}
      </div>

      <button className="update-shipping-btn" onClick={updateShippingDetails}>
        Proceed to Payment
      </button>
    </div>
  );
}

export default ShippingAndCheckout;
