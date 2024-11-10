import "../pages/styles/Pagination.css";

function Pagination({ page, setPage, isLast }) {
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="pagination-controls">
      <button onClick={handlePrevPage} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={handleNextPage} disabled={isLast}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
