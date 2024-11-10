import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "../pages/styles/ShippingAndCheckout.css";

const apiUrl = config.API_URL;

function ShippingAndCheckout() {
  const { bearerToken, userData } = useContext(LoginContext);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    shippingType: "standard",
    address: userData?.address || {
      address: "",
      apartment: "",
      city: "",
      zipCode: "",
    },
  });
  const { invoiceId } = useParams();

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
  }, [bearerToken, invoiceId]);

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
      if (!checkout.ok) throw session;

      window.location.href = session.sessionUrl;
    } catch (err) {
      console.log(
        err.message || "Couldn't proceed checkout, please try again later."
      );
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
        <div className="address-form">
          <h4>Shipping Address</h4>
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

      <button onClick={updateShippingDetails}>Proceed to Payment</button>
    </div>
  );
}

export default ShippingAndCheckout;
