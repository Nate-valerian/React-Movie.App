import { useState, useEffect } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../lib/supabaseClient";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
        : `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section with hero.png */}
      <section className="hero-section">
        <div className="hero-banner">
          <img
            src="/hero.png"
            alt="AVATAR THE WAY OF WATER"
            className="hero-image"
          />
        </div>

        <h1 className="hero-title">
          Find Movies You'll Enjoy{" "}
          <span className="highlight">Without the Hassle</span>
        </h1>

        <p className="hero-subtitle">Search through thousands of movies</p>

        <div className="search-container">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchMovies={fetchMovies}
          />
        </div>
      </section>

      <div className="divider"></div>

      {/* Trending Movies */}
      <section className="trending-section">
        <h2 className="section-title">Trending Movies</h2>
        <div className="trending-grid">
          {trendingMovies.slice(0, 5).map((movie, index) => (
            <div key={movie.movie_id || index} className="trending-card">
              <div className="trending-rank">#{index + 1}</div>
              <div className="trending-poster">
                <img
                  src={movie.poster_url || "https://via.placeholder.com/60x90"}
                  alt={movie.title || "Movie"}
                />
              </div>
              <div className="trending-info">
                <h3>{movie.title || "Movie Title"}</h3>
                <p className="search-count">
                  Searched {movie.count || 0} times
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      {/* All Movies */}
      <section className="all-movies-section">
        <h2 className="section-title">All Movies</h2>

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <div className="movies-grid">
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
