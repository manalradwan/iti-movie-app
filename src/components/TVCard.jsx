import { useContext } from "react";
import { Link } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContext";
import { IMAGE_BASE_URL } from "../api/tmdb";
import "./TVCard.css";

export default function TVCard({ show }) {
  const { isInWatchlist, toggleWatchlist } = useContext(MoviesContext);

  const posterUrl = show?.poster_path
    ? `${IMAGE_BASE_URL}${show.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const rating = show?.vote_average ? show.vote_average.toFixed(1) : "N/A";
  const releaseYear = show?.first_air_date ? show.first_air_date.split("-")[0] : "";
  const isSaved = show?.id ? isInWatchlist(show.id) : false;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (show) {
      toggleWatchlist(show);
    }
  };

  return (
    <div className="tv-card">
      <Link to={`/tv/${show?.id}`} className="tv-card-link">
        <div className="tv-poster-wrapper">
          <img src={posterUrl} alt={show?.name || "TV Show"} loading="lazy" />
          <span className="tv-badge">TV Show</span>
          <span className="tv-rating">★ {rating}</span>
        </div>
        <div className="tv-info">
          <h3 className="tv-title" title={show?.name}>{show?.name}</h3>
          <div className="tv-card-bottom">
            <span className="tv-year">{releaseYear}</span>
            <button
              type="button"
              className={`tv-heart-btn ${isSaved ? "saved" : ""}`}
              onClick={handleHeartClick}
              aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
              title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <i className={isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

