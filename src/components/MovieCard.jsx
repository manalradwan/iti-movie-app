import { useContext } from "react";
import { Link } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContext";
import { IMAGE_BASE_URL } from "../api/tmdb";
import "./MovieCard.css";

export default function MovieCard({ movie, onDoubleClick }) {
  const { isInWatchlist, toggleWatchlist } = useContext(MoviesContext);

  const posterUrl = movie?.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseYear = movie?.release_date ? movie.release_date.split("-")[0] : "";
  const isSaved = movie?.id ? isInWatchlist(movie.id) : false;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie) {
      toggleWatchlist(movie);
    }
  };

  return (
    <div
      className="movie-card card"
      onDoubleClick={onDoubleClick}
    >
      <Link to={`/movie/${movie?.id}`} className="movie-card-link">
        <div className="movie-poster-wrapper poster-container">
          <img src={posterUrl} alt={movie?.title || "Movie"} loading="lazy" />
          <span className="movie-badge">Movie</span>
          <span className="movie-rating rating">★ {rating}</span>
        </div>
        <div className="movie-info card-content">
          <h3 className="movie-title" title={movie?.title}>{movie?.title}</h3>
          <div className="movie-card-bottom card-bottom">
            <span className="movie-year date">{releaseYear || movie?.release_date}</span>
            <button
              type="button"
              className={`movie-heart-btn heart ${isSaved ? "saved" : ""}`}
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
