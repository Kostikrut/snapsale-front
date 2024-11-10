import { Link } from "react-router-dom";

import capitalize from "../utils/capitalizeStr";

import "../pages/styles/CategoryPreview.css";

function CategoryPreview({ category, listings }) {
  return (
    <div className="category-preview">
      <div className="category-name">
        <img
          className="category-img-cover"
          src={category?.imageUrl}
          alt={category.category}
        />
        <span>{capitalize(category.category)}</span>
      </div>
      <div className="listings-preview-container">
        <div className="listings">
          {listings.map((listing) => (
            <Link
              to={`/product/${listing._id}`}
              key={listing._id}
              className="listing-link"
            >
              <div className="listing-preview">
                <img
                  src={listing.image.imageUrl}
                  alt={`${listing.title}`}
                  className="listing-img"
                />
                <div className="listing-info">
                  <span className="rating">{`${listing.ratingsAvg}/10 (${listing.numRatings})`}</span>
                  <span className="brand">{listing.brand}</span>
                  <span className="title">{listing.title}</span>
                  <span className="price">{listing.price} $</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to={`/category/${category.category}`}
          className="see-more-btn"
          aria-label="See more listings"
        >
          ...
        </Link>
      </div>
    </div>
  );
}

export default CategoryPreview;
