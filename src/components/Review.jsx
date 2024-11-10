function Review({ review }) {
  const { content, createdAt, rating, title, user } = review;

  const formattedDate = new Date(parseInt(createdAt, 10)).toLocaleDateString();

  return (
    <div className="review">
      <h2 className="review-title">{title}</h2>
      <p className="review-content">{content}</p>
      <div className="review-footer">
        <span className="review-user">Reviewed by: {user.fullName}</span>
        <span className="review-date"> | Date: {formattedDate}</span>
        <span className="review-rating"> | Rating: {rating}/10</span>
      </div>
    </div>
  );
}

export default Review;
