import React, { useContext } from "react";

import { FavoriteContext } from "../contexts/FavoritesContext";
import ProductPreview from "../components/ProductPreview";

import "./styles/FavoritesPage.css";

const FavoritesPage = () => {
  const { favorites } = useContext(FavoriteContext);

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <p className="favorites-empty">You have no favorite items yet.</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">Your Favorites</h2>
      <div className="favorites-list">
        {favorites.map((product) => (
          <ProductPreview
            product={product}
            type="favorite"
            key={product.title}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
