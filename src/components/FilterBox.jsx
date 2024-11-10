import React, { useState } from "react";
import Slider from "rc-slider";
import "../pages/styles/FilterBox.css";
import "rc-slider/assets/index.css";

const FilterBox = ({ listings, setLimit, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, calcMaxPriceRange()]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [limit, setLimiter] = useState(10); // State for current limit

  function calcMaxPriceRange() {
    let max = 0;
    listings.forEach((listing) => {
      if (listing.price >= max) max = listing.price;
    });
    return max;
  }

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const handleBrandChange = (brand) => {
    const newSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newSelectedBrands);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
  };

  const handleFilterProducts = () => {
    const filteredFields = { priceRange, selectedBrands, sortOption };
    onFilterChange(filteredFields);
    setLimit(limit); // Call setLimit with the current limit only when filter is applied
  };

  const handleLimitChange = (limitItems) => {
    setLimiter(limitItems); // Update the limit state when a new limit is selected
  };

  const uniqueBrands = [...new Set(listings.map((listing) => listing.brand))];

  return (
    <div className="filter-box">
      <div className="filter-section">
        <h3>Price Range</h3>
        <Slider
          range
          max={calcMaxPriceRange()}
          defaultValue={priceRange}
          onChange={handlePriceChange}
        />
        <div>
          ${priceRange[0]} - ${priceRange[1]}
        </div>
      </div>

      <div className="filter-section">
        <h3>Brands</h3>
        {uniqueBrands.map((brand) => (
          <div key={brand}>
            <label>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              {brand}
            </label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-section">
        <h3>Items Per Page</h3>
        {[10, 20, 30, 50].map((limitItems) => (
          <div key={limitItems}>
            <label>
              <input
                style={{ margin: "5px" }}
                type="radio"
                checked={limitItems === limit}
                onChange={() => handleLimitChange(limitItems)}
              />
              {` ${limitItems} - items`}
            </label>
          </div>
        ))}
      </div>

      <div className="filter-btn">
        <button className="filter-btn" onClick={handleFilterProducts}>
          Filter
        </button>
      </div>
    </div>
  );
};

export default FilterBox;
