import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MoviesProvider from "./context/MoviesProvider";
import Layout from "./components/Layout";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import TVShowsPage from "./pages/TVShowsPage";
import TVDetailsPage from "./pages/TVDetailsPage";
import Watchlist from "./pages/Watchlist";
import Search from "./components/Search";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <MoviesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Home / Movies Catalog */}
            <Route index element={<MoviesPage />} />
            <Route path="movies" element={<MoviesPage />} />

            {/* Movie Details (Mona) */}
            <Route path="movie/:id" element={<MovieDetailsPage />} />

            {/* TV Shows & TV Show Details (Manal) */}
            <Route path="tv" element={<TVShowsPage />} />
            <Route path="tv/:id" element={<TVDetailsPage />} />

            {/* Watchlist / Wishlist (Wafaa) */}
            <Route path="wishlist" element={<Watchlist />} />
            <Route path="watchlist" element={<Watchlist />} />

            {/* Search Results */}
            <Route path="search" element={<Search />} />

            {/* Dedicated AI Chatbot Page */}
            <Route path="chatbot" element={<Chatbot />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MoviesProvider>
  );
}

export default App;