const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();
  return data.genres;
};

export const discoverMovies = async (params: {
  genre?: number;
  year?: number;
  rating?: number;
  page?: number;
}) => {
  const query = new URLSearchParams({
    api_key: API_KEY,
    ...(params.genre && { with_genres: params.genre.toString() }),
    ...(params.year && { primary_release_year: params.year.toString() }),
    ...(params.rating && { "vote_average.gte": params.rating.toString() }),
    page: (params.page || 1).toString(),
  });

  const res = await fetch(`${BASE_URL}/discover/movie?${query}`);
  return res.json();
};
export const fetchTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json(); // { results: [...] }
};
