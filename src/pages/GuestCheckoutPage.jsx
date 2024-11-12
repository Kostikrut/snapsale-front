import React, { useContext, useState } from "react";

import { CartContext } from "../contexts/CartContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/GuestCheckoutPage.css";

const apiUrl = config.API_URL;

const GuestCheckoutPage = () => {
  const { cart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    shippingType: "standard",
    address: {
      city: "",
      address: "",
      apartment: "",
      zipCode: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "address", "apartment", "zipCode"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const guestInfo = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
    };

    const addressStr = `${formData.address.city}, ${formData.address.address},  ${formData.address.apartment}, ${formData.address.zipCode}`;

    const shippingOpt = {
      shippingType: formData.shippingType,
      address: addressStr,
    };

    try {
      const res = await fetch(`${apiUrl}/api/v1/invoices/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestInfo, shippingOpt, cart }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      const session = await fetch(
        `${apiUrl}/api/v1/invoices/${data.data.invoice._id}/createCheckoutSession/guest`,
        {
          method: "POST",
        }
      );

      const sessionData = await session.json();
      if (!session.ok) throw sessionData;

      window.location.href = sessionData.sessionUrl;
    } catch (err) {
      console.log(err);
      renderToast(
        "error",
        err.message || "Couldnt create invoice, please try again later."
      );
    }
  };

  return (
    <div className="guest-checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Shipping Type</label>
          <select
            name="shippingType"
            value={formData.shippingType}
            onChange={handleChange}
            required
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="store">Pickup From Store</option>
          </select>
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="address"
            value={formData.address.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apartment Number</label>
          <input
            type="text"
            name="apartment"
            value={formData.address.apartment}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="checkout-button">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default GuestCheckoutPage;
