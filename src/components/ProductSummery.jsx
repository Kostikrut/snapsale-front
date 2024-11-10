import { useState, useEffect, useContext } from "react";

import ReviewsBox from "./ReviewsBox";
import { CartContext } from "../contexts/CartContext";
import { FavoriteContext } from "../contexts/FavoritesContext";

import FavoriteIcon from "../assets/Icons/favorite-fill.svg";
import FadedFavoriteIcon from "../assets/Icons/favorite-fill-faded.svg";
import "../pages/styles/ProductPage.css";

const sortVariantsByName = (variants) => {
  const variantNameSet = new Set(variants?.map((variant) => variant.name));
  let sortedVariants = [];

  variantNameSet.forEach((name) => {
    const variantsWithSameName = variants.filter(
      (variant) => variant.name === name
    );
    sortedVariants.push([...variantsWithSameName]);
  });

  return sortedVariants;
};

function ProductSummery({ product }) {
  const [variants] = useState(sortVariantsByName(product.variants));
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [totalPrice, setTotalPrice] = useState(Number(product.price));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorite, isFavorite } =
    useContext(FavoriteContext);

  useEffect(() => {
    const variantTotal = selectedVariants.reduce(
      (acc, variant) => acc + Number(variant.price),
      0
    );
    setTotalPrice(Number(product.price) + variantTotal);

    const allVariantsSelected = variants.every((group) =>
      selectedVariants.some((variant) => variant.name === group[0].name)
    );
    setIsButtonDisabled(!allVariantsSelected);
  }, [selectedVariants, product.price, variants]);

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFromFavorite(product.id);
    } else {
      addToFavorites(product);
    }
  };
  const handleVariantSelect = (variantName, variant) => {
    setSelectedVariants((prev) => {
      const updatedVariants = prev.filter((v) => v.name !== variantName);
      return [...updatedVariants, variant];
    });
  };

  const handleAddToCart = () => {
    const productWithVariants = {
      ...product,
      variants: selectedVariants,
    };
    addToCart(productWithVariants);
  };

  return (
    <div>
      <div className="product-cta">
        <div className="product-image">
          <img src={product?.image?.url} alt={product.title} />
        </div>
        <div className="product-rating">
          <span>
            {product.ratingsAvg}/10⭐️ ({product.numRatings})
          </span>
        </div>

        <div className="product-variants-select">
          {variants.map((variantGroup, index) => (
            <div key={index} className="variant-section">
              <h4>Select {variantGroup[0].name}</h4>
              <div className="variant-options">
                {variantGroup.map((variant, idx) => (
                  <div
                    key={idx}
                    className={`variant-box ${
                      selectedVariants.some(
                        (selected) =>
                          selected.name === variant.name &&
                          selected.type === variant.type
                      )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleVariantSelect(variant.name, variant)}
                  >
                    <p>{variant.type}</p>
                    <p className="variant-price">
                      +${Number(variant.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="product-price">
          <p>Total: ${totalPrice.toFixed(2)}</p>
        </div>

        <div className="cta-btns-container">
          <button
            onClick={handleAddToCart}
            className="add-to-cart-button"
            disabled={isButtonDisabled}
          >
            Add to Cart
          </button>
          <button onClick={handleFavoriteClick} className="favorite-button">
            {!isFavorite(product.id) ? (
              <img
                className="favorite-icons"
                src={FadedFavoriteIcon}
                alt="Favorite"
              />
            ) : (
              <img
                className="favorite-icons"
                src={FavoriteIcon}
                alt="Favorite"
              />
            )}
          </button>
        </div>

        <div className="product-reviews-container">
          <ReviewsBox reviews={product.reviews} />
        </div>
      </div>
    </div>
  );
}

export default ProductSummery;
