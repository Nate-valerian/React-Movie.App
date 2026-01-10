const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch genres");
  const data = await res.json();
  return data.genres || [];
};

export const discoverMovies = async ({ genre, year, rating, page } = {}) => {
  const query = new URLSearchParams();
  query.set("api_key", API_KEY);
  query.set("page", String(page || 1));
  query.set("sort_by", "popularity.desc"); // stable default

  if (genre != null) query.set("with_genres", String(genre));
  if (year != null) query.set("primary_release_year", String(year));
  if (rating != null) query.set("vote_average.gte", String(rating));

  const res = await fetch(`${BASE_URL}/discover/movie?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to discover movies");
  return res.json();
};

export const fetchTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
};

// export const fetchMovieDetails = async (id) => {
//   const res = await fetch(
//     `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
//   );
//   if (!res.ok) throw new Error

//   return res.json();
// };
