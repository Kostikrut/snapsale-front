import { useContext } from "react";

import { FavoriteContext } from "../contexts/FavoritesContext";

import FavoriteIcon from "../assets/Icons/favorite-fill.svg";
import FadedFavoriteIcon from "../assets/Icons/favorite-fill-faded.svg";
import "../pages/styles/ProductPreview.css";

function ProductPreview({ product, type }) {
  let imageUrl = product.image ? product.image.url : "default-image-url.png"; // {{DO LATER}} Change to default image url
  const { addToFavorites, removeFromFavorite, isFavorite } =
    useContext(FavoriteContext);

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFromFavorite(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="product-preview">
      <div className="product-img-container">
        {product.discount > 0 && (
          <div className="discount-badge">{`-${product.discount}%`}</div>
        )}
        <img className="product-image" src={imageUrl} alt={product.slug} />
      </div>
      <div className="product-preview-details">
        <h6>{product.brand}</h6>
        <h6>{product.title}</h6>
        <span>
          {product.ratingsAvg}/10⭐️ ({product.numRatings})
        </span>
        <div className="price-container">
          {product.discount > 0 ? (
            <>
              {!product.discount && (
                <span className=" original-price">{product.price} $</span>
              )}
              {product.discount > 0 && (
                <span className=" discounted-price">
                  {(product.price * (1 - product.discount / 100)).toFixed(0)} $
                </span>
              )}
            </>
          ) : (
            <span className="price">{product.price} $</span>
          )}
        </div>
      </div>
      <div className="product-preview-btns">
        <a href={`/product/${product.id}`}>
          <button className="view-product">View Product</button>
        </a>
        <button onClick={handleFavoriteClick}>
          {!isFavorite(product.id) ? (
            <img
              className="favorite-icons"
              src={FadedFavoriteIcon}
              alt="Favorite"
            />
          ) : (
            <img className="favorite-icons" src={FavoriteIcon} alt="Favorite" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductPreview;
