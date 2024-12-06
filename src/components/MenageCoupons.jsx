import React, { useState, useEffect, useContext, useCallback } from "react";

import renderToast from "../utils/renderToast";
import { config } from "../config";
import { LoginContext } from "../contexts/LoginContext";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../pages/styles/MenageCoupons.css";

const apiUrl = config.API_URL;

const CouponManager = () => {
  const { bearerToken } = useContext(LoginContext);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    usageLimit: "",
    expirationDate: "",
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
  });

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch(apiUrl + "/api/v1/coupons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
      });

      const { data } = await res.json();

      if (res.ok) setCoupons(data.coupons);
    } catch (error) {
      renderToast("error", "An error occurred while fetching coupons.");
    }
  }, [bearerToken]);

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingCoupon ? "PUT" : "POST";
      const url = editingCoupon
        ? apiUrl + `/api/v1/coupons`
        : apiUrl + `/api/v1/coupons`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        renderToast(
          "success",
          `Coupon ${editingCoupon ? "updated" : "created"} successfully.`
        );
        fetchCoupons();
        setEditingCoupon(null);
        resetForm();
      } else {
        renderToast("error", data.message || "Failed to save coupon.");
      }
    } catch (error) {
      renderToast("error", "An error occurred while saving the coupon.");
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      usageLimit: coupon.usageLimit,
      expirationDate: coupon.expirationDate.slice(0, 10), // Format for input type="date"
      isActive: coupon.isActive,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        renderToast("success", "Coupon deleted successfully.");
        fetchCoupons();
      } else {
        renderToast("error", data.message || "Failed to delete coupon.");
      }
    } catch (error) {
      renderToast("error", "An error occurred while deleting the coupon.");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      usageLimit: "",
      expirationDate: "",
      isActive: true,
      applicableProducts: [],
      applicableCategories: [],
    });
  };

  return (
    <div className="coupon-manager">
      <ToastContainer />

      <form onSubmit={handleFormSubmit}>
        <h2>{editingCoupon ? "Edit Coupon" : "Add Coupon"}</h2>

        <label>
          Code:
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Discount Type:
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleInputChange}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>

        <label>
          Discount Value:
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleInputChange}
            required
            min="0"
          />
        </label>

        <label>
          Minimum Order Value:
          <input
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleInputChange}
            min="0"
          />
        </label>

        <label>
          Usage Limit:
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            min="0"
          />
        </label>

        <label>
          Expiration Date:
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Active:
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Applicable Products (comma-separated IDs):
          <input
            type="text"
            name="applicableProducts"
            value={formData.applicableProducts.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                applicableProducts: e.target.value
                  .split(",")
                  .map((id) => id.trim()),
              }))
            }
          />
        </label>

        <label>
          Applicable Categories (comma-separated IDs):
          <input
            type="text"
            name="applicableCategories"
            value={formData.applicableCategories.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                applicableCategories: e.target.value
                  .split(",")
                  .map((id) => id.trim()),
              }))
            }
          />
        </label>

        <button type="submit">{editingCoupon ? "Update" : "Add"} Coupon</button>
        {editingCoupon && <button onClick={resetForm}>Cancel</button>}
      </form>

      <h2>Existing Coupons</h2>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon._id}>
            <p>
              <strong>Code:</strong> {coupon.code} | <strong>Discount:</strong>{" "}
              {coupon.discountType === "percentage"
                ? `${coupon.discountValue}%`
                : `$${coupon.discountValue}`}{" "}
              | <strong>Expires:</strong>{" "}
              {new Date(coupon.expirationDate).toLocaleDateString()}
            </p>
            <button onClick={() => handleEdit(coupon)}>Edit</button>
            <button onClick={() => handleDelete(coupon._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponManager;
