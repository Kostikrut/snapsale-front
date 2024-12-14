import { useEffect, useState } from "react";
import { config } from "../config";

function SearchList({ searchText, searchListRef, action }) {
  const [searchResaults, setSearchResaults] = useState([]);

  const apiUrl = config.API_URL;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchListings() {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/listings/search?title=${searchText}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error("No listings found.");
        }

        if (!data.data.length) return;

        setSearchResaults(data.data);

        controller.abort();
      } catch (err) {
        console.log(err);
      }
    }

    fetchListings();
  }, [apiUrl, searchText]);

  return (
    <div className="search-list-container">
      <ul className="search-list" ref={searchListRef}>
        {searchResaults.map((listing, i) => {
          return (
            <li className="list-item" key={listing._id}>
              <a href={`/product/${listing._id}`}>
                {
                  <img
                    className="list-item-img"
                    src={`${listing.image.url}`}
                    alt={listing.slag}
                  />
                }
                {listing.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchList;
