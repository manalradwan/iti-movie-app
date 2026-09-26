import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContext";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import "../App.css";

function MoviesPage() {
  const {
    movies,
    loading,
    error,
    page,
    setPage,
    watchlist,
    toggleWatchlist
  } = useContext(MoviesContext);

  // 1. هنعمل الـ State اللي هتقرأ الأفلام المضافة وتخلّي القلوب تلوّن فوراً
  const [localWatchlist, setLocalWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem('userWatchlist')) || [];
  }); //wafaa

  // Synchronize localWatchlist if context changes
  useEffect(() => {
    if (watchlist) {
      setLocalWatchlist(watchlist);
    }
  }, [watchlist]);

  // 2. دالة الإضافة والحذف من غير ما نعدل في الـ Context برة
  const addToWatchlist = (movie) => {
    if (toggleWatchlist) {
      toggleWatchlist(movie);
    } else {
      let currentWatchlist = JSON.parse(localStorage.getItem('userWatchlist')) || [];
      const isExist = currentWatchlist.some(item => item.id === movie.id);
      
      if (!isExist) {
          currentWatchlist.push(movie);
      } else {
          currentWatchlist = currentWatchlist.filter(item => item.id !== movie.id); // لو ضغطتِ تاني يتشال من المفضلة
      }
      
      localStorage.setItem('userWatchlist', JSON.stringify(currentWatchlist));
      setLocalWatchlist(currentWatchlist); // تحديث الألوان في نفس اللحظة
    }
  };

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const scrollPosition = useRef(0);

  // تغيير الصفحة
  function changePage(newPage) {
    scrollPosition.current = window.scrollY;
    setPage(newPage);
  }

  // Search
  function handleSearch() {
    if (search.trim() === "") {
      return;
    }

    navigate(`/search?query=${encodeURIComponent(search)}`);
  }

  // بعد ما الأفلام الجديدة تحمل، نرجع لنفس مكان الـ scroll
  useEffect(() => {
    if (scrollPosition.current > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition.current);
      });
    }
  }, [movies]);

  if (loading) {
    return <h2 className="message">Loading movies...</h2>;
  }

  if (error) {
    return <h2 className="message">{error}</h2>;
  }

  return (
    <div className="container">

      <div className="welcome">

        <h1>Welcome to our movie app</h1>

        <p>
          Millions of movies, TV shows and people to discover.
          Explore now.
        </p>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search and explore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

      </div>

      <h2 className="section-title">Now Playing</h2>

      <div className="movies">

        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onDoubleClick={() => navigate(`/movie/${movie.id}`)} //Mona
          />
        ))}

      </div>

      <Pagination
        currentPage={page}
        onPageChange={changePage}
      />

    </div>
  );
}

export default MoviesPage;
