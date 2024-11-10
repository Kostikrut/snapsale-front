import { useContext, useState } from "react";

import { LoginContext } from "../contexts/LoginContext";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "../pages/styles/AddListingVariants.css";

const apiUrl = config.API_URL;

function AddListingVariant() {
  const { bearerToken } = useContext(LoginContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedListings, setSearchedListings] = useState([]);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleEditExistingVariant = ({ variant }) => {
    setFormData(variant);
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/listings/search?title=${searchQuery}`
      );

      const data = await res.json();

      if (res.status === 404 || !res.ok) throw data;

      setSearchedListings(data.data);
      setListing(null);
    } catch (err) {
      renderToast(
        "error",
        err.message || "An error occurred while searching for listing"
      );
    }
  };

  const handleSelectListing = (e) => {
    const { value } = e.target;

    const listing = searchedListings.filter((listing) => listing._id === value);

    setListing(listing[0]);
  };

  const handleAddVariant = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("image", formData.image);

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/listings/${listing._id}/variants`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
          body: data,
        }
      );

      const resData = await res.json();
      // console.log(resData);

      if (!res.ok) throw resData;

      renderToast("success", "New variant added successfully");
      setFormData({});
    } catch (err) {
      renderToast(
        "error",
        err.message || "An error occurred while adding new variant"
      );
    }
  };

  return (
    <div className="manage-variants-container">
      <div className="search-menage-listing-container">
        <h1>Add Listing Variants</h1>
        <div className="lisitng-search-bar">
          <input
            type="text"
            placeholder="Enter listing title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {searchedListings.length > 0 && (
          <select onChange={handleSelectListing}>
            <option value="">Select a listing</option>

            {searchedListings.map((listing) => (
              <option
                key={listing._id}
                value={listing._id}
              >{`${listing.title}`}</option>
            ))}
          </select>
        )}
      </div>
      {listing?.variants.length > 0 && (
        <div className="variants-container">
          {listing.variants.map((variant) => {
            return (
              <div className="variant" key={variant.name + variant.type}>
                <div onClick={(e) => handleEditExistingVariant({ variant })}>
                  <img
                    className="variant-img"
                    src={variant.image.url}
                    alt={variant.type}
                  />
                </div>
                <div>
                  <h3>{variant.name}</h3>
                  <p>Type: {variant.type}</p>
                  <p>Price: {variant.price}</p>
                  <p>In Stock: {variant.stock}</p>
                </div>
                <button className="delete-variant">Delete Variant</button>
              </div>
            );
          })}
        </div>
      )}
      {listing && (
        <div className="listing-variants-container">
          <h2>
            <span>Add new variant to: </span>
            <strong>{listing.title}</strong>
          </h2>
          <div className="listing-variants">
            <div className="listing-variant">
              {formData.image && (
                <img src={formData.image.url} alt={formData.title} />
              )}
              <div>
                <label>Variant Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Variant Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Price Added:</label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  value={formData.price || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  min={0}
                  value={formData.stock || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Variant Image:</label>
                <input type="file" name="image" onChange={handleImageChange} />
              </div>
            </div>
            <div className="variant-ctas">
              <button onClick={handleAddVariant}>Add New Variant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddListingVariant;
