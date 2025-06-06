import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";

import { LoginContext } from "../contexts/LoginContext";
import useCategory from "../hooks/useCategory";
import SearchBar from "./SearchBar";

import { config } from "../config";
import capitalize from "../utils/capitalizeStr";

import "../pages/styles/Header.css";
import AccountIcon from "./../assets/Icons/login.svg";
import FavoritesIcon from "./../assets/Icons/favorite.svg";
import ShoppingCartIcon from "./../assets/Icons/shopping-cart.svg";
import CategoriesIcon from "./../assets/Icons/categories.svg";

function Header() {
  const { userData } = useContext(LoginContext);
  const categories = useCategory();
  const [marquees, setMarquees] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesDropdownRef = useRef(null);

  const apiUrl = config.API_URL;

  const toggleCategories = (e) => {
    e.stopPropagation();
    setShowCategories((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (
      categoriesDropdownRef.current &&
      !categoriesDropdownRef.current.contains(e.target)
    ) {
      setShowCategories(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchMarquees = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/marquees/`, {
          method: "GET",
        });

        const { data } = await res.json();

        setMarquees(data.marquees);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarquees();
  }, [apiUrl]);

  return (
    <header>
      <div className="header-main">
        <Link to="/">
          <h1 className="logo">SnapSale.</h1>
        </Link>

        <SearchBar />

        <div className="links-container">
          <ul className="header-links">
            <li>
              <Link to="/cart">
                <div className="link-container">
                  <img
                    className="header-icons"
                    src={ShoppingCartIcon}
                    alt="Shopping Cart"
                  />
                  <span className="header-link-name">Shopping Cart</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/favorites">
                <div className="link-container">
                  <img
                    className="header-icons"
                    src={FavoritesIcon}
                    alt="Favorites"
                  />
                  <span className="header-link-name">Favorites</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/account">
                <div className="link-container">
                  {!userData?.image?.url ? (
                    <img
                      className="header-icons"
                      src={AccountIcon}
                      alt="Account"
                    />
                  ) : (
                    <img
                      className="header-icons"
                      src={userData.image.url}
                      alt="Account"
                    />
                  )}
                  <span className="header-link-name">Account</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="header-navigator">
        <button className="categories-btn" onClick={toggleCategories}>
          <span>Categories</span>
          <img src={CategoriesIcon} alt="categories list" />
        </button>
        {showCategories && (
          <div className="categories-dropdown show" ref={categoriesDropdownRef}>
            <ul>
              {categories.map((category, i) => (
                <li key={i}>
                  <Link
                    to={`/category/${category.category}`}
                    onClick={toggleCategories}
                  >
                    {capitalize(category.category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* <Link to="/on-sale">
          <button className="onsale-btn">
            <span>On Sale</span>
            <img src={SaleIcon} alt="on sale" />
          </button>
        </Link> */}
        <Marquee
          className="marquees-container"
          pauseOnHover={true}
          gradient={true}
          gradientColor="var(--color-primary-dark)"
          gradientWidth={100}
        >
          {marquees.length > 0 && (
            <div className="marquee-list">
              {marquees.map((marquee, i) => (
                <Link to={marquee?.link} key={marquee.title + i}>
                  <p style={{ color: "#fff" }}>{marquee.content}</p>
                </Link>
              ))}
            </div>
          )}
        </Marquee>
      </div>
    </header>
  );
}

export default Header;
