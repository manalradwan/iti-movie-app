import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import "../App.css";

function Search() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query");

  const [search, setSearch] = useState(query || "");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = "0b954ffe12bfa38875c3defdbb9f0b9c";

  // لو الـ query اتغير من الـ URL
  useEffect(() => {
    setSearch(query || "");
  }, [query]);


  // البحث
  function handleSearch() {

    if (search.trim() === "") {
      return;
    }

    navigate(`/search?query=${encodeURIComponent(search)}`);
  }


  // جلب نتائج البحث
  useEffect(() => {

    async function searchMovies() {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        setMovies(result.results);

      } catch (error) {

        setError(error.message);

      } finally {

        setLoading(false);

      }

    }

    if (query) {
      searchMovies();
    }

  }, [query]);


  if (loading) {
    return (
      <div className="container">

        <div className="search-box">

          <input
            type="text"
            placeholder="Search and explore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        <h2 className="message">
          Searching...
        </h2>

      </div>
    );
  }


  if (error) {
    return (
      <div className="container">

        <div className="search-box">

          <input
            type="text"
            placeholder="Search and explore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        <h2 className="message">
          {error}
        </h2>

      </div>
    );
  }


  return (
    <div className="container">

      {/* Search Box */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search and explore..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>

      </div>


      {/* Search Results */}

      <h2 className="section-title">
        Search results for: {query}
      </h2>

      <div className="movies">

        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

      </div>


      {movies.length === 0 && (
        <p className="no-movies">
          No movies found.
        </p>
      )}

    </div>
  );
}

export default Search;
