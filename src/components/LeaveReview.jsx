import "../pages/styles/LeaveReview.css";
import React, { useState } from "react";
import StarRating from "../utils/StarRating";
import "react-toastify/dist/ReactToastify.css";

const LeaveReview = ({
  listingId,
  invoiceId,
  closeReviewModal,
  handlePostReview,
}) => {
  const [reviewTitleText, setReviewTitleText] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <div className="review-modal">
      <form>
        <textarea
          value={reviewTitleText}
          onChange={(e) => setReviewTitleText(e.target.value)}
          placeholder="Title... (Up to 60 characters)"
          rows="1"
          maxLength="60"
        />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Review... (Up to 500 characters)"
          rows="5"
          maxLength="500"
        />
        <div>
          <label className="rating-label">Rating: </label>

          <StarRating
            maxRating={10}
            color="#124e66"
            size={30}
            onSetRating={(e) => setRating(e)}
          />
        </div>
        <div className="review-btns">
          <button
            type="button"
            onClick={() =>
              handlePostReview(listingId, {
                invoice: invoiceId,
                title: reviewTitleText,
                content: reviewText,
                rating,
              })
            }
          >
            Submit Review
          </button>
          <button type="button" onClick={() => closeReviewModal(listingId)}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReview;
