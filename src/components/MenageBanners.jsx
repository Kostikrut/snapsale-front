import React, { useState, useEffect, useContext, useCallback } from "react";

import { LoginContext } from "../contexts/LoginContext";
import { config } from "../config";

import "../pages/styles/MenageBanners.css";

const apiUrl = config.API_URL;

const MenageBanners = () => {
  const { bearerToken } = useContext(LoginContext);
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    isActive: true,
  });
  const [editingBanner, setEditingBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/banners`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
      });

      const data = await res.json();
      setBanners(data.data.banners);
    } catch (error) {
      console.error("Error fetching banners", error);
    }
  }, [bearerToken]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await fetch(
        editingBanner
          ? `${apiUrl}/api/v1/banners/${editingBanner._id}`
          : `${apiUrl}/api/v1/banners`,
        {
          method: editingBanner ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) throw data;

      setFormData({ title: "", link: "", isActive: true, image: null });
      setEditingBanner(null);
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({ ...banner, image: null });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/api/v1/banners/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
      });

      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner", error);
    }
  };

  return (
    <div className="banner-container">
      <form onSubmit={handleSubmit} className="banner-form">
        <h1>Add New Banner</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={formData.link}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          required={!editingBanner}
        />
        <label>
          Active:
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {editingBanner ? "Update" : "Create"} Banner
        </button>
      </form>

      <ul className="banner-list">
        {banners.map((banner) => (
          <li key={banner._id} className="banner-item">
            <img src={banner.image.url} alt={banner.title} />
            <h3>{banner.title}</h3>
            <p>Link: {banner.link}</p>
            <p>Active: {banner.isActive ? "Yes" : "No"}</p>
            <button onClick={() => handleEdit(banner)}>Edit</button>
            <button onClick={() => handleDelete(banner._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenageBanners;
