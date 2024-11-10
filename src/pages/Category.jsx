import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProductPreview from "./../components/ProductPreview";
import FilterBox from "../components/FilterBox";

import { config } from "../../src/config";

import "./styles/CategoryPage.css";
import { useLoading } from "../contexts/LoadingContext";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { loading: PageLoading, showLoading, hideLoading } = useLoading();

  const apiUrl = config.API_URL;

  const handleFilterChange = (newFilters) => {
    let filter;

    filter = products.filter(
      (product) =>
        product.price >= newFilters.priceRange[0] &&
        product.price <= newFilters.priceRange[1]
    );

    if (newFilters.selectedBrands.length > 0) {
      filter = filter.filter((product) =>
        newFilters.selectedBrands.includes(product.brand)
      );
    }

    switch (newFilters.sortOption) {
      case "price-asc":
        filter = filter.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filter = filter.sort((a, b) => b.price - a.price);
        break;
      default:
        filter = filter.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    setFilteredProducts(filter);
  };

  useEffect(() => {
    showLoading();
    const getProducts = async () => {
      try {
        const fetchProducts = await axios.get(
          `${apiUrl}/api/v1/listings?category=${category}&page=${page}&limit=${limit}`
        );
        const data = fetchProducts.data.data;
        const isLast = fetchProducts.data.isLastPage;

        setIsLastPage(isLast);
        setProducts(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        hideLoading();
      }
    };

    getProducts();
  }, [category, apiUrl, showLoading, hideLoading, page, limit]);

  return (
    <div className="category-container">
      <FilterBox
        listings={[...products]}
        setLimit={setLimit}
        onFilterChange={handleFilterChange}
      />
      <div className="category-list-container">
        {PageLoading ? (
          <Loading />
        ) : (
          <>
            <div>
              <h1>Product List</h1>
              <ul className="product-preview-list">
                {filteredProducts.length > 0
                  ? filteredProducts.map((product) => (
                      <ProductPreview product={product} key={product.title} />
                    ))
                  : products.map((product) => (
                      <ProductPreview product={product} key={product.title} />
                    ))}
              </ul>
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              isLast={isLastPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Category;
