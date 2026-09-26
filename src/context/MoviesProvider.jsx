import { useEffect, useState } from "react";
import { MoviesContext } from "./MoviesContext";

function MoviesProvider({ children }) {

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const apiKey = "0b954ffe12bfa38875c3defdbb9f0b9c";

  useEffect(() => {

    async function getMovies() {

      try {

        setError("");

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        console.log(result);

        setMovies(result.results);

      } catch (error) {

        console.log(error);
        setError(error.message);

      } finally {

        setLoading(false);

      }
    }

    getMovies();

  }, [page]);


  // Unified Watchlist state shared across Movies and TV Shows (persisted to localStorage)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userWatchlist")) || [];
    } catch {
      return [];
    }
  });

  const toggleWatchlist = (item) => {
    if (!item || !item.id) return;

    setWatchlist((prevList) => {
      const exists = prevList.some((i) => i.id === item.id);
      let updated;
      if (exists) {
        updated = prevList.filter((i) => i.id !== item.id);
      } else {
        // Normalize fields so both movies and TV shows render properly in the Watchlist page
        const normalizedItem = {
          id: item.id,
          title: item.title || item.name || "Untitled",
          name: item.name || item.title || "Untitled",
          poster_path: item.poster_path || "",
          backdrop_path: item.backdrop_path || "",
          vote_average: typeof item.vote_average === "number" ? item.vote_average : 0,
          release_date: item.release_date || item.first_air_date || "",
          first_air_date: item.first_air_date || item.release_date || "",
          overview: item.overview || "",
          media_type: item.media_type || (item.first_air_date ? "tv" : "movie"),
        };
        updated = [...prevList, normalizedItem];
      }
      try {
        localStorage.setItem("userWatchlist", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save watchlist to localStorage:", e);
      }
      return updated;
    });
  };

  const isInWatchlist = (id) => {
    return watchlist.some((item) => item.id === id);
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prevList) => {
      const updated = prevList.filter((item) => item.id !== id);
      try {
        localStorage.setItem("userWatchlist", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update watchlist in localStorage:", e);
      }
      return updated;
    });
  };

  return (

    <MoviesContext.Provider
      value={{
        movies,
        loading,
        error,
        page,
        setPage,
        watchlist,
        toggleWatchlist,
        addToWatchlist: toggleWatchlist,
        removeFromWatchlist,
        isInWatchlist
      }}
    >

      {children}

    </MoviesContext.Provider>

  );
}

export default MoviesProvider;
