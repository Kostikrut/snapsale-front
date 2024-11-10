import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";

import renderToast from "../utils/renderToast";
import useCategory from "../hooks/useCategory";
import { LoginContext } from "../contexts/LoginContext";
import { config } from "../config";

import "../pages/styles/MenageCategories.css";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = config.API_URL;

function MenageCategories() {
  const { bearerToken } = useContext(LoginContext);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImg, setNewCategoryImg] = useState(null);
  const categories = useCategory(refetchTrigger);

  const handleDeleteCategory = async (category) => {
    try {
      const res = await fetch(apiUrl + `/api/v1/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ category }),
      });

      const resData = await res.json();

      if (!res.ok) throw resData;

      setRefetchTrigger((prev) => !prev);
      return renderToast("success", "Category deleted successfuly");
    } catch (error) {
      return renderToast(
        "error",
        error.message || "Couldn't delete category, please try again."
      );
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !newCategoryImg)
      return renderToast("error", "Please fill all fields");

    try {
      const formData = new FormData();
      formData.append("category", newCategory);
      formData.append("image", newCategoryImg);

      const res = await fetch(apiUrl + `/api/v1/categories`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw data;

      setNewCategory("");
      setNewCategoryImg(null);
      setRefetchTrigger((prev) => !prev);
      return renderToast("success", "Category added successfully");
    } catch (err) {
      return renderToast(
        "error",
        err.message || "Couldn't add category, please try again."
      );
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="menage-categories-container">
        {categories.length && (
          <ul className="delete-category-list">
            {categories.map((cat) => (
              <li className="category-item" key={cat.category}>
                <img
                  className="category-img"
                  src={cat?.imageUrl}
                  alt={cat.category}
                />
                <div className="category-item-name">{cat.category}</div>
                <button
                  className="delete-catefory-btn"
                  onClick={() => handleDeleteCategory(cat.category)}
                >
                  Delete Category
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="add-category-container">
          <div className="category-inputs-container">
            <input
              type="text"
              placeholder="Add a new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="add-category-input"
            />
            <input
              type="file"
              name="image"
              className="add-category-img"
              onChange={(e) => setNewCategoryImg(e.target.files[0])}
            />
          </div>
          <button onClick={handleAddCategory} className="add-category-button">
            Add Category
          </button>
        </div>
      </div>
    </>
  );
}

export default MenageCategories;
