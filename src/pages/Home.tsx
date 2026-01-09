import { useState, useEffect } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../lib/supabaseClient";
import { fetchGenres, discoverMovies, fetchTrendingMovies } from "../lib/tmdb";
import AuthBar from "../components/AuthBar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const navigate = useNavigate();

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
      const data = await fetchTrendingMovies();
      setTrendingMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching TMDB trending:", error);
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (!selectedGenre && !year && !rating) return;

    const fetchFilteredMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await discoverMovies({
          genre: selectedGenre ?? undefined,
          year: year ?? undefined,
          rating: rating ?? undefined,
        });

        setMovieList(data.results || []);
      } catch (error) {
        setErrorMessage("Failed to load filtered movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [selectedGenre, year, rating]);

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

      <div className="controls-bar">
        <AuthBar />
        <button className="control-btn" onClick={() => navigate("/watchlist")}>
          ⭐ My Watchlist
        </button>

        <div className="filters-inline">
          <select
            value={selectedGenre ?? ""}
            onChange={(e) =>
              setSelectedGenre(e.target.value ? Number(e.target.value) : null)
            }
            className="control-input"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year"
            value={year ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : null)
            }
            className="control-input"
          />

          <select
            value={rating ?? ""}
            onChange={(e) =>
              setRating(e.target.value ? Number(e.target.value) : null)
            }
            className="control-input"
          >
            <option value="">Any Rating</option>
            <option value="5">5+</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
          </select>
        </div>
      </div>

      <div className="divider"></div>
      {/* Trending Movies */}
      <section className="trending-section">
        <h2 className="section-title">Trending Movies</h2>

        <div className="trending-grid">
          {trendingMovies.slice(0, 4).map((movie, index) => (
            <div key={movie.id} className="trending-card">
              <div className="trending-rank">#{index + 1}</div>

              <div className="trending-poster">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/60x90"
                  }
                  alt={movie.title}
                />
              </div>

              <div className="trending-info">
                <h3>{movie.title}</h3>
                <p className="search-count">
                  ⭐ {movie.vote_average?.toFixed(1) ?? "N/A"}
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
