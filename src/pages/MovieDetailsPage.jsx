import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getRecommendations, IMAGE_BASE_URL } from "../api/tmdb";
import { MoviesContext } from "../context/MoviesContext";
import MovieCard from "../components/MovieCard";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const { id } = useParams();
  const { isInWatchlist, toggleWatchlist } = useContext(MoviesContext);
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        try {
          const recData = await getRecommendations(id);
          setRecommendations(recData || []);
        } catch (recErr) {
          console.error("Failed to load recommendations:", recErr);
        }
      } catch (err) {
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <div className="details-status">Loading movie details...</div>;
  if (error || !movie) return <div className="details-status error">{error || "Movie not found"}</div>;

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const isSaved = movie?.id ? isInWatchlist(movie.id) : false;

  return (
    <div className="movie-details-container">
      {backdropUrl && (
        <div
          className="details-hero-bg"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}
      <div className="details-content">
        <Link to="/" className="back-link">← Back to Movies</Link>
        <div className="details-main-grid">
          <div className="details-poster">
            <img
              src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
              alt={movie.title}
            />
          </div>
          <div className="details-info">
            <div className="details-title-row">
              <h1 className="details-title">{movie.title}</h1>
              <button
                type="button"
                className={`details-watchlist-btn ${isSaved ? "saved" : ""}`}
                onClick={() => toggleWatchlist(movie)}
                aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <i className={isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                <span>{isSaved ? "In Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>
            {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}
            <div className="details-metrics">
              {movie.vote_average && (
                <span className="metric-pill rating">★ {movie.vote_average.toFixed(1)}</span>
              )}
              {movie.runtime ? (
                <span className="metric-pill">{movie.runtime} min</span>
              ) : null}
              {movie.release_date ? (
                <span className="metric-pill">{movie.release_date.split("-")[0]}</span>
              ) : null}
            </div>
            <div className="details-genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
            <div className="details-section">
              <h3>Overview</h3>
              <p className="overview-text">{movie.overview || "No overview available."}</p>
            </div>
          </div>
        </div>

        {/* Similar / Recommended Movies Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="movie-recommendations-section">
            <h3 className="recommendations-heading">Similar / Recommended Movies</h3>
            <div className="recommendations-grid">
              {recommendations.slice(0, 10).map((rec) => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailsPage;

