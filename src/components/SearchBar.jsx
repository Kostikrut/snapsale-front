import { useState, useRef, useEffect } from "react";
import SearchList from "./SearchList";
import SearchIcon from "./../assets/Icons/search.svg";
import "../pages/styles/SearchBar.css";

function SearchBar() {
  const [searchFieldText, setSearchFieldText] = useState("");
  const [isListOpen, seIsListOpen] = useState(false);
  const searchListRef = useRef(null);

  const handleInputChange = (e) => {
    if (e.target.value) {
      seIsListOpen(true);
      setSearchFieldText(e.target.value);
    } else {
      seIsListOpen(false);
    }
  };

  const handleClickOutside = (e) => {
    if (searchListRef.current && !searchListRef.current.contains(e.target)) {
      seIsListOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <form className="search-bar">
        <input
          className="search-field"
          type="text"
          name="search"
          placeholder="Search for product"
          onChange={handleInputChange}
        />
        <button type="submit">
          <img src={SearchIcon} alt="search icon" />
        </button>
        {isListOpen && (
          <SearchList
            searchText={searchFieldText}
            searchListRef={searchListRef}
            action={"redirect"}
          />
        )}
      </form>
    </div>
  );
}

export default SearchBar;
