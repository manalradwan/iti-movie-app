import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getTVDetails, getTVRecommendations, IMAGE_BASE_URL } from "../api/tmdb";
import { MoviesContext } from "../context/MoviesContext";
import TVCard from "../components/TVCard";
import "./TVDetailsPage.css";

export default function TVDetailsPage() {
  const { id } = useParams();
  const { isInWatchlist, toggleWatchlist } = useContext(MoviesContext);
  const [show, setShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTVDetails(id);
        setShow(data);

        // Fetch Similar / Recommended TV Shows
        try {
          const recData = await getTVRecommendations(id);
          setRecommendations(recData || []);
        } catch (recErr) {
          console.error("Failed to load TV recommendations:", recErr);
        }
      } catch (err) {
        setError(err.message || "Failed to load series details");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <div className="details-status">Loading series details...</div>;
  if (error || !show) return <div className="details-status error">{error || "Series not found"}</div>;

  const backdropUrl = show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : null;
  const isSaved = show?.id ? isInWatchlist(show.id) : false;

  return (
    <div className="tv-details-container">
      {backdropUrl && <div className="details-hero-bg" style={{ backgroundImage: `url(${backdropUrl})` }} />}
      <div className="details-content">
        <Link to="/tv" className="back-link">← Back to TV Shows</Link>
        <div className="details-main-grid">
          <div className="details-poster">
            <img src={show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} alt={show.name} />
          </div>
          <div className="details-info">
            <div className="details-title-row">
              <h1 className="details-title">{show.name}</h1>
              <button
                type="button"
                className={`details-watchlist-btn ${isSaved ? "saved" : ""}`}
                onClick={() => toggleWatchlist(show)}
                aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <i className={isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                <span>{isSaved ? "In Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>
            {show.tagline && <p className="details-tagline">"{show.tagline}"</p>}
            <div className="details-metrics">
              <span className="metric-pill rating">★ {show.vote_average?.toFixed(1)}</span>
              <span className="metric-pill">Seasons: {show.number_of_seasons}</span>
              <span className="metric-pill">Episodes: {show.number_of_episodes}</span>
              <span className="metric-pill">{show.first_air_date?.split("-")[0]}</span>
            </div>
            <div className="details-genres">
              {show.genres?.map((g) => (<span key={g.id} className="genre-tag">{g.name}</span>))}
            </div>
            <div className="details-section">
              <h3>Overview</h3>
              <p className="overview-text">{show.overview || "No overview available."}</p>
            </div>
          </div>
        </div>

        {/* Similar / Recommended TV Shows Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="tv-recommendations-section">
            <h3 className="recommendations-heading">Similar / Recommended TV Shows</h3>
            <div className="recommendations-grid">
              {recommendations.slice(0, 10).map((item) => (
                <TVCard key={item.id} show={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
