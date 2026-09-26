const API_KEY = "0b954ffe12bfa38875c3defdbb9f0b9c";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// --- TV Shows APIs (Manal) ---
export async function getPopularTV(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
  if (!res.ok) throw new Error("Failed to load TV shows");
  return await res.json();
}

export async function getTVDetails(seriesId) {
  const res = await fetch(`${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to load show details");
  return await res.json();
}

export async function getTVRecommendations(seriesId) {
  const res = await fetch(`${BASE_URL}/tv/${seriesId}/recommendations?api_key=${API_KEY}`);
  if (!res.ok) {
    // Fallback to similar endpoint if recommendations returns error
    const fallbackRes = await fetch(`${BASE_URL}/tv/${seriesId}/similar?api_key=${API_KEY}`);
    if (!fallbackRes.ok) throw new Error("Failed to load TV recommendations");
    const fallbackData = await fallbackRes.json();
    return fallbackData.results;
  }
  const data = await res.json();
  // If recommendations is empty, try similar
  if (!data.results || data.results.length === 0) {
    const similarRes = await fetch(`${BASE_URL}/tv/${seriesId}/similar?api_key=${API_KEY}`);
    if (similarRes.ok) {
      const similarData = await similarRes.json();
      return similarData.results;
    }
  }
  return data.results;
}

export async function getSimilarTV(seriesId) {
  const res = await fetch(`${BASE_URL}/tv/${seriesId}/similar?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to load similar TV shows");
  const data = await res.json();
  return data.results;
}

// --- Movie Details & Recommendations APIs (Mona & Wafaa) ---
export async function getMovieDetails(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to load movie details");
  return await res.json();
}

export async function getRecommendations(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to load recommendations");
  const data = await res.json();
  return data.results;
}
