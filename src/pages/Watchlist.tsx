import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setMovies(
        data.map((item) => ({
          id: item.movie_id,
          title: item.title,
          poster_path: item.poster_path,
          release_date: item.release_year ? `${item.release_year}-01-01` : null,
          vote_average: item.vote_average,
        }))
      );
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="movie-details-loading">
        <div className="spinner"></div>
        <p>Loading watchlist...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2 className="section-title">My Watchlist</h2>

      {movies.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          Your watchlist is empty. Start adding movies ⭐
        </p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
