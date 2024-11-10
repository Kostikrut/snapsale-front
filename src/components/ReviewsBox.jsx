import Review from "./Review";
import "../pages/styles/ReviewBox.css";

function ReviewsBox({ reviews }) {
  if (!reviews.length > 0) return;

  return (
    <div className="reviews-container">
      {reviews.map((review) => (
        <Review review={review} key={review._id} />
      ))}
    </div>
  );
}

export default ReviewsBox;
