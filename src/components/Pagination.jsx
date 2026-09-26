import "./Pagination.css";

export default function Pagination({ currentPage, totalPages = 500, onPageChange }) {
  const maxPages = totalPages > 500 ? 500 : (totalPages || 500);

  // Generate numbered pages window around currentPage (currentPage - 2 to currentPage + 2)
  const pages = [];
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i >= 1 && i <= maxPages) {
      pages.push(i);
    }
  }

  return (
    <div className="pagination">
      <button
        className="arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {pages.map((number) => (
        <button
          key={number}
          className={currentPage === number ? "active" : ""}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        className="arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= maxPages}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}

