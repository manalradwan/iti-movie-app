import { useState, useEffect } from "react";
import { getPopularTV } from "../api/tmdb";
import TVCard from "../components/TVCard";
import Pagination from "../components/Pagination";
import "./TVShowsPage.css";

export default function TVShowsPage() {
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadShows() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPopularTV(currentPage);
        setShows(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message || "Failed to load shows");
      } finally {
        setLoading(false);
      }
    }
    loadShows();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="tv-page-container">
      <header className="tv-header">
        <h1>Popular TV Shows</h1>
        <p>Explore top-rated and trending television series</p>
      </header>
      {loading && <div className="tv-status">Loading series...</div>}
      {error && <div className="tv-status error">{error}</div>}
      {!loading && !error && (
        <>
          <div className="tv-grid">
            {shows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </>
      )}
    </div>
  );
}
