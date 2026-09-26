import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MoviesContext } from '../context/MoviesContext';
import './watchlist.css';
import '../App.css';

const Watchlist = () => {
  const context = useContext(MoviesContext);
  // Read from MoviesContext or directly from Local Storage
  const watchlist = context?.watchlist || JSON.parse(localStorage.getItem('userWatchlist')) || [];

  // Function to remove from watchlist
  const handleRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (context?.removeFromWatchlist) {
      context.removeFromWatchlist(id);
    } else {
      const updatedList = watchlist.filter(item => item.id !== id);
      localStorage.setItem('userWatchlist', JSON.stringify(updatedList));
      window.location.reload();
    }
  };

  return (
    <div className="watchlist-container" style={{ padding: '20px', minHeight: '80vh' }}>
      <h1 className="watchlist-title" style={{ borderBottom: '2px solid #ffd92f', paddingBottom: '10px', marginBottom: '30px', color: '#fff' }}>
        Watch list
      </h1>

      {/* الحالة الأولى: لو القائمة فارغة يعرض القلب المكسور */}
      {watchlist.length === 0 ? (
        <div className="empty-watchlist" style={{ textAlign: 'center', marginTop: '50px' }}>
          <div className="empty-icon-wrapper" style={{ fontSize: '50px' }}>💔</div>
          <p className="empty-text" style={{ color: '#aaa', margin: '20px 0' }}>No titles in watch list</p>
          <Link to="/" className="btn-back-home" style={{ backgroundColor: '#ffd92f', color: '#000', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to home
          </Link>
        </div>
      ) : (
        /* الحالة الثانية: عرض الأفلام والمسلسلات بنفس كلاسات وتصميم الصفحة الرئيسية بالظبط */
        <div className="movies">
          {watchlist.map((item) => {
            const isTv = Boolean(item.first_air_date || item.media_type === 'tv' || item.name && !item.title);
            const detailUrl = isTv ? `/tv/${item.id}` : `/movie/${item.id}`;
            const displayTitle = item.title || item.name || "Untitled";
            const displayDate = item.release_date || item.first_air_date || "";

            return (
              <div className="card" key={item.id}>
                <Link to={detailUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="poster-container">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={displayTitle}
                    />
                    {isTv && <span className="tv-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>TV Show</span>}
                    {!isTv && <span className="movie-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#ffd92f', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Movie</span>}
                    {item.vote_average && (
                      <span className="rating">
                        ★ {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <h3>{displayTitle}</h3>
                    <div className="card-bottom">
                      <p className="date">{displayDate}</p>
                      
                      {/* زرار القلب الأحمر للحذف من الـ Watchlist */}
                      <span 
                        className="heart saved" 
                        onClick={(e) => handleRemove(e, item.id)} 
                        style={{ cursor: 'pointer' }}
                        title="Remove from watchlist"
                      >
                        <i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;

