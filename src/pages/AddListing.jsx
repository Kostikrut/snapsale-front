import React, { useContext, useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import { ToastContainer } from "react-toastify";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import debounce from "lodash/debounce";
import { config } from "../config";

import "react-toastify/dist/ReactToastify.css";
import "suneditor/dist/css/suneditor.min.css";
import useCategory from "../hooks/useCategory";

const apiUrl = config.API_URL;
const defaultFormData = {
  brand: "",
  title: "",
  category: "",
  tags: "",
  description: "",
  price: "",
  image: null,
};

const AddListing = ({ editListing, setListing, setSearchedListings }) => {
  const { bearerToken } = useContext(LoginContext);
  const [formData, setFormData] = useState(defaultFormData);
  const categories = useCategory();

  useEffect(() => {
    if (editListing) {
      const { title, category, description, price, brand } = editListing;
      const tags = editListing.tags;
      setFormData({ title, category, description, price, tags, brand });
    }
  }, [editListing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearDataFields = () => {
    setFormData(defaultFormData);
  };

  const handleDescriptionChange = debounce((value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  }, 200);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleDeleteListing = async (id) => {
    const res = await fetch(`${apiUrl}/api/v1/listings/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!res.ok)
      return renderToast(
        "error",
        "Listing could not be deleted, please re-login and try again"
      );

    clearDataFields();
    setListing(null);
    setSearchedListings([]);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    const data = new FormData();
    data.append("brand", formData.brand);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("tags", JSON.stringify(tagsArray));
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      const res = await fetch(`${apiUrl}/api/v1/listings`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        body: data,
      });

      const resData = await res.json();

      if (!res.ok) throw resData;

      renderToast("success", "New listing created Successfuly");
      clearDataFields();
    } catch (err) {
      renderToast(
        "error",
        err.message ||
          "Listing could not be created, please re-login and try again"
      );
    }
  };

  const handleEditListing = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags;

    const data = new FormData();
    data.append("brand", formData.brand);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("tags", JSON.stringify(tagsArray));
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) {
      data.append("image", formData.image);
    }
    try {
      const res = await fetch(`${apiUrl}/api/v1/listings/${editListing._id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        body: data,
      });

      const resData = await res.json();

      if (!res.ok) throw resData;

      renderToast("success", "Listing updated Successfuly");
    } catch (err) {
      renderToast(
        "error",
        err.message ||
          "Listing could not be updated, please re-login and try again"
      );
    }
  };

  return (
    <div className="add-listing-container">
      <div className="listing-header">
        <h1>{editListing ? "Edit Listing" : "Add New Listing"}</h1>
        {editListing && (
          <button
            className="delete-listing"
            onClick={(e) => handleDeleteListing(editListing._id)}
          >
            Delete Listing
          </button>
        )}
      </div>
      <form
        className="add-listing-form"
        onSubmit={editListing ? handleEditListing : handleCreateListing}
      >
        {editListing && (
          <div className="listing-img">
            <img
              src={`${editListing.image.url}`}
              alt={`${editListing.title}`}
            />
          </div>
        )}

        <div>
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value={formData.category}>{formData.category}</option>
            {categories.map(
              (cat) =>
                formData.category !== cat.category && (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                )
            )}
          </select>
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div>
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            required={!editListing ? true : false}
          />
        </div>

        <div className="description-field">
          <label>Description</label>
          {formData.description !== undefined && (
            <SunEditor
              setContents={formData.description}
              setOptions={{
                height: 300,
                buttonList: [
                  ["undo", "redo", "font", "fontSize", "formatBlock"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["removeFormat"],
                  ["fontColor", "hiliteColor"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "table"],
                  ["link", "image"],
                ],
              }}
              setDefaultStyle="height: 600px; overflow-y: auto;"
              onChange={handleDescriptionChange}
            />
          )}
        </div>

        <button className="add-listing-btn" type="submit">
          Add Listing
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddListing;
