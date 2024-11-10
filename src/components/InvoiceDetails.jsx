import { useContext, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { LoginContext } from "../contexts/LoginContext";
import LeaveReview from "./LeaveReview";
import renderToast from "../utils/renderToast";
import { fetchImagesUrls } from "../utils/fetchImagesUrls";
import { config } from "../config";

import "../pages/styles/PurchaseHistory.css";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = config.API_URL;

function InvoiceDetails({ invoice }) {
  const [isReviewOpen, setIsReviewOpen] = useState([]);
  const [reviewedListings, setReviewedListings] = useState([]);
  const [listingsWithImages, setListingsWithImages] = useState([]);
  const { bearerToken } = useContext(LoginContext);

  useEffect(() => {
    const fetchImages = async () => {
      const imagesName = invoice.listings.map(
        (listing) => listing.image.filename
      );

      try {
        const urls = await fetchImagesUrls(imagesName);
        const listingsWithUrls = invoice.listings.map((listing, index) => ({
          ...listing,
          image: { ...listing.image, url: urls[index] },
        }));

        setListingsWithImages(listingsWithUrls);
      } catch (err) {
        console.error("Couldn't fetch images:", err.message || err);
      }
    };

    fetchImages();
  }, [invoice]);

  const handlePostReview = async (listingId, data) => {
    if (!data.title || !data.content || !data.rating) {
      return renderToast(
        "error",
        "You must fill all the fields to leave a review."
      );
    }

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/listings/${listingId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const resData = await res.json();
      if (!res.ok) throw resData;

      if (resData.status === "success") {
        renderToast("success", "Review added successfully!");
        setReviewedListings((prev) => [...prev, listingId]);
        handleCloseReviewModal(listingId);
      }
    } catch (err) {
      renderToast(
        "error",
        err.message || "An error occurred while posting the review."
      );
    }
  };

  const HandleOpenReviewField = (newListingId) => {
    setIsReviewOpen((prev) => [...prev, newListingId]);
  };

  const handleCloseReviewModal = (listingToRemove) => {
    setIsReviewOpen((prev) =>
      prev.filter((listing) => listing !== listingToRemove)
    );
  };

  return (
    <>
      <div className="invoice">
        <h2>Invoice #{invoice._id}</h2>
        <p>
          <strong>Total Price:</strong> ${invoice.totalPrice}
        </p>
        <p>
          <strong>Currency:</strong> {invoice.currency}
        </p>
        <p>
          <strong>Paid:</strong> {invoice.isPaid ? "Yes" : "No"}
        </p>
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
        <p>
          <strong>Purchase Date:</strong>{" "}
          {new Date(invoice.createdAt).toLocaleString()}
        </p>

        <h3>Items:</h3>
        <ul className="items-section">
          {listingsWithImages.map((listing, index) => (
            <li key={index}>
              <div className="item-container">
                <img
                  src={listing.image.url}
                  alt={listing.title}
                  style={{ width: "100px" }}
                />
                <div className="item-details">
                  <p>
                    <strong>Title:</strong>{" "}
                    {`${listing.brand} ${listing.title} ${listing.variants
                      .map((variant) => variant.type)
                      .join(", ")}`}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {listing.amount}
                  </p>
                  <p>
                    <strong>Price:</strong> $
                    {(listing.price * listing.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              {!invoice.reviewLeft.includes(listing._id) &&
                !isReviewOpen.includes(listing._id) &&
                !reviewedListings.includes(listing._id) && (
                  <button
                    className="leave-review-btn"
                    onClick={() => HandleOpenReviewField(listing._id)}
                  >
                    Leave a review
                  </button>
                )}
              {isReviewOpen.includes(listing._id) && (
                <LeaveReview
                  listingId={listing._id}
                  invoiceId={invoice._id}
                  closeReviewModal={handleCloseReviewModal}
                  handlePostReview={handlePostReview}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </>
  );
}

export default InvoiceDetails;
