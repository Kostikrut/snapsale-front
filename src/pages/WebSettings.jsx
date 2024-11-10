import { useState } from "react";

import AddListingPage from "./AddListing";
import MenageListings from "./MenageListings";
import MenageCategories from "../components/MenageCategories";
import MenageUsers from "../components/MenageUsers";
import AddListingVariant from "../components/AddListingVariant";

import "./styles/AddListingPage.css";
import "./styles/WebSettings.css";

function WebSettings() {
  const [selectedOption, setSelectedOption] = useState("add-listing");
  const listItems = [
    { "Add Listing": "add-listing" },
    { "Manage Listings": "manage-listings" },
    { "Manage Listing Variants": "manage-variants" },
    { "Manage Categories": "manage-categories" },
    { "Manage Users": "manage-users" },
  ];

  const renderListItem = (buttonText, className) => {
    return (
      <li
        key={className}
        onClick={() => setSelectedOption(`${className}`)}
        className={`web-settings-option ${
          selectedOption === `${className}` ? "active" : ""
        }`}
      >
        {buttonText}
      </li>
    );
  };

  return (
    <div className="web-settings-container">
      <aside className="web-settings-sidebar">
        <ul className="web-settings-options">
          {listItems.map((item) =>
            renderListItem(Object.keys(item)[0], Object.values(item)[0])
          )}
        </ul>
      </aside>

      <div className="web-Settings-content">
        {selectedOption === "add-listing" && <AddListingPage />}
        {selectedOption === "manage-listings" && <MenageListings />}
        {selectedOption === "manage-variants" && <AddListingVariant />}
        {selectedOption === "manage-categories" && <MenageCategories />}
        {selectedOption === "manage-users" && <MenageUsers />}
      </div>
    </div>
  );
}

export default WebSettings;
