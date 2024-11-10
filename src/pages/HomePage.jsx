import { useEffect, useState } from "react";

import useCategory from "../hooks/useCategory";
import CategoryPreview from "../components/CategoryPreview";
import Carousel from "../components/Carousel";

import { config } from "../../src/config";

import "./styles/HomePage.css";

const getFetchedHomePage = () => {
  const savedListings = localStorage.getItem("homePageListings");
  const savedTimestamp = localStorage.getItem("homePageListingsTimestamp");
  const isExpired =
    savedTimestamp && Date.now() - savedTimestamp > 15 * 60 * 1000; // 15 minutes

  if (savedListings && !isExpired) {
    return JSON.parse(savedListings);
  }

  if (isExpired) {
    localStorage.removeItem("homePageListings");
    localStorage.removeItem("homePageListingsTimestamp");
  }

  return [];
};
function HomePage() {
  const categories = useCategory();
  const [listings, setListings] = useState(getFetchedHomePage());

  const apiUrl = config.API_URL;

  useEffect(() => {
    if (listings.length === 0) {
      const getListings = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/v1/listings/loadHomePage`);
          const data = await res.json();
          if (!res.ok) throw data;

          setListings(data.data);
          localStorage.setItem("homePageListings", JSON.stringify(data.data));
          localStorage.setItem(
            "homePageListingsTimestamp",
            Date.now().toString()
          );
        } catch (err) {
          console.error(err.message || "Could not fetch listings");
        }
      };

      getListings();
    }
  }, [apiUrl, listings.length]);

  return (
    <div className="homepage">
      <Carousel
        banners={[
          {
            src: "https://rosenbach.org/wp-content/uploads/2018/09/Moby-Dick-graphic-1500x500.jpg",
          },
        ]}
      />
      <div className="category-preview-container">
        {listings.map((listing) => {
          const category = categories.find((el) => el.category === listing._id);

          return category ? (
            <CategoryPreview
              category={category}
              listings={listing.listings}
              key={listing._id}
            />
          ) : null; // If category is not found, don't render the component
        })}
      </div>
    </div>
  );
}

export default HomePage;
