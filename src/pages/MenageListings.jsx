import React, { useState } from "react";

import AddListingPage from "./AddListing";
import renderToast from "../utils/renderToast";
import { config } from "../config";

import "./styles/MenageListings.css";

const apiUrl = config.API_URL;

const MenageListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedListings, setSearchedListings] = useState([]);
  const [listing, setListing] = useState(null);

  const handleClearSearch = () => {
    setSearchedListings([]);
    setListing(null);
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

  return (
    <div className="manage-listing-container">
      <div className="search-menage-listing-container">
        <h1>Manage Listing</h1>
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

      {listing && (
        <AddListingPage
          editListing={listing}
          handleClearSearch={handleClearSearch}
          setListing={setListing}
          setSearchedListings={setSearchedListings}
        />
      )}
    </div>
  );
};

export default MenageListings;
