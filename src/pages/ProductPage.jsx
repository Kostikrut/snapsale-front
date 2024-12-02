import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useLoading } from "../contexts/LoadingContext";

import ProductSummery from "../components/ProductSummery";
import NotFoundPage from "./NotFoundPage";
import Loading from "../components/Loading";
import { config } from "../config";

import "./styles/ProductPage.css";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const { loading, showLoading, hideLoading } = useLoading();

  const apiUrl = config.API_URL;

  useEffect(() => {
    showLoading();
    const getProduct = async () => {
      try {
        const fetchProduct = await axios.get(
          `${apiUrl}/api/v1/listings/${productId}`
        );

        const data = fetchProduct.data.data.listing;

        setProduct(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        hideLoading();
      }
    };

    getProduct();
  }, [apiUrl, productId, showLoading, hideLoading]);

  return (
    <div className="product-page-container">
      {loading ? (
        <Loading />
      ) : product ? (
        <>
          <div className="product-overview-container">
            <div className="product-details">
              <h1 className="product-title">{product.title}</h1>
              <p
                className="product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></p>
            </div>
          </div>
          <ProductSummery product={product} />{" "}
        </>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}

export default ProductPage;
