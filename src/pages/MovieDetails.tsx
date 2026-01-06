import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
  };
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchMovieDetails(parseInt(id));
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
      );

      if (!response.ok) throw new Error("Failed to fetch movie details");

      const data = await response.json();
      setMovie(data);

      // Log the view in Supabase
      await logMovieView(movieId, data.title);
    } catch (err) {
      setError("Failed to load movie details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logMovieView = async (movieId: number, title: string) => {
    try {
      await supabase.from("movie_views").insert({
        movie_id: movieId,
        title: title,
        viewed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error logging movie view:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="movie-details-loading">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="movie-details-error">
        <h2>Error loading movie</h2>
        <p>{error || "Movie not found"}</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </div>
    );
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className="movie-details-page">
      {/* Back button */}
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Movies
        </button>
      </div>

      {/* Movie Header */}
      <div className="movie-header">
        <div className="container">
          <div className="movie-header-content">
            {/* Movie Poster */}
            <div className="movie-poster-large">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>

            {/* Movie Info */}
            <div className="movie-info">
              <h1 className="movie-title">
                {movie.title}{" "}
                <span className="movie-year">({releaseYear})</span>
              </h1>

              {/* Rating */}
              <div className="movie-rating-section">
                <div className="rating-badge">
                  <span className="star">⭐</span>
                  <span className="rating-score">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="rating-votes">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Runtime & Release Date */}
              <div className="movie-meta">
                {movie.runtime && (
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span className="meta-text">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}

                {movie.release_date && (
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">
                      {new Date(movie.release_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="movie-content">
          {/* Overview Section */}
          <section className="overview-section">
            <h2 className="section-heading">Overview</h2>
            <p className="movie-overview">{movie.overview}</p>
          </section>

          {/* Cast Section */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <section className="cast-section">
              <h2 className="section-heading">Cast</h2>
              <div className="cast-grid">
                {movie.credits.cast.slice(0, 10).map((person) => (
                  <div key={person.id} className="cast-card">
                    <div className="cast-photo">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                        />
                      ) : (
                        <div className="no-photo">No Photo</div>
                      )}
                    </div>
                    <div className="cast-info">
                      <h4 className="cast-name">{person.name}</h4>
                      <p className="cast-character">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back to Home Button */}
          <div className="action-buttons">
            <button className="home-button" onClick={() => navigate("/")}>
              ← Browse More Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// interface MovieDetails {
//   id: number;
//   title: string;
//   overview: string;
//   poster_path: string;
//   backdrop_path: string;
//   release_date: string;
//   runtime: number;
//   vote_average: number;
//   vote_count: number;
//   genres: { id: number; name: string }[];
//   credits?: {
//     cast: Array<{
//       id: number;
//       name: string;
//       character: string;
//       profile_path: string;
//     }>;
//     crew: Array<{
//       id: number;
//       name: string;
//       job: string;
//       profile_path: string;
//     }>;
//   };
//   videos?: {
//     results: Array<{
//       key: string;
//       name: string;
//       site: string;
//       type: string;
//     }>;
//   };
// }

// const MovieDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [movie, setMovie] = useState<MovieDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     if (id) {
//       fetchMovieDetails(parseInt(id));
//     }
//   }, [id]);

//   const fetchMovieDetails = async (movieId: number) => {
//     try {
//       setLoading(true);

//       // Fetch movie details with credits and videos
//       const response = await fetch(
//         `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
//       );

//       if (!response.ok) throw new Error("Failed to fetch movie details");

//       const data = await response.json();
//       setMovie(data);

//       // Log the view in Supabase
//       await logMovieView(movieId, data.title);
//     } catch (err) {
//       setError("Failed to load movie details");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logMovieView = async (movieId: number, title: string) => {
//     try {
//       await supabase.from("movie_views").insert({
//         movie_id: movieId,
//         title: title,
//         viewed_at: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("Error logging movie view:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading movie details...</p>
//       </div>
//     );
//   }

//   if (error || !movie) {
//     return (
//       <div className="error-container">
//         <h2>Error loading movie</h2>
//         <p>{error || "Movie not found"}</p>
//         <button onClick={() => navigate("/")}>Go Back Home</button>
//       </div>
//     );
//   }

//   return (
//     <div className="movie-details">
//       {/* Backdrop Image */}
//       {movie.backdrop_path && (
//         <div className="backdrop">
//           <img
//             src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
//             alt={movie.title}
//           />
//           <div className="backdrop-overlay"></div>
//         </div>
//       )}

//       {/* Movie Content */}
//       <div className="movie-content">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="movie-header">
//           <div className="poster">
//             <img
//               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//               alt={movie.title}
//             />
//           </div>

//           <div className="movie-info">
//             <h1>
//               {movie.title}{" "}
//               <span className="year">
//                 ({new Date(movie.release_date).getFullYear()})
//               </span>
//             </h1>

//             <div className="meta-info">
//               <div className="rating">
//                 <span className="star">⭐</span>
//                 <span className="score">{movie.vote_average.toFixed(1)}</span>
//                 <span className="votes">
//                   ({movie.vote_count.toLocaleString()} votes)
//                 </span>
//               </div>

//               {movie.runtime && (
//                 <div className="runtime">
//                   <span className="clock">⏱️</span>
//                   <span>
//                     {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
//                   </span>
//                 </div>
//               )}

//               <div className="release-date">
//                 <span className="calendar">📅</span>
//                 <span>{new Date(movie.release_date).toLocaleDateString()}</span>
//               </div>
//             </div>

//             <div className="genres">
//               {movie.genres.map((genre) => (
//                 <span key={genre.id} className="genre-tag">
//                   {genre.name}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="tabs">
//           <button
//             className={`tab ${activeTab === "overview" ? "active" : ""}`}
//             onClick={() => setActiveTab("overview")}
//           >
//             Overview
//           </button>
//           <button
//             className={`tab ${activeTab === "cast" ? "active" : ""}`}
//             onClick={() => setActiveTab("cast")}
//           >
//             Cast
//           </button>
//           <button
//             className={`tab ${activeTab === "videos" ? "active" : ""}`}
//             onClick={() => setActiveTab("videos")}
//           >
//             Videos
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === "overview" && (
//             <div className="overview">
//               <h2>Overview</h2>
//               <p>{movie.overview}</p>

//               {movie.videos?.results?.find(
//                 (v) => v.site === "YouTube" && v.type === "Trailer"
//               ) && (
//                 <div className="trailer">
//                   <h3>Watch Trailer</h3>
//                   <div className="trailer-video">
//                     <iframe
//                       width="100%"
//                       height="400"
//                       src={`https://www.youtube.com/embed/${movie.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer")?.key}`}
//                       title="Trailer"
//                       frameBorder="0"
//                       allowFullScreen
//                     ></iframe>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === "cast" && movie.credits?.cast && (
//             <div className="cast">
//               <h2>Cast</h2>
//               <div className="cast-grid">
//                 {movie.credits.cast.slice(0, 10).map((person) => (
//                   <div key={person.id} className="cast-member">
//                     {person.profile_path ? (
//                       <img
//                         src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
//                         alt={person.name}
//                       />
//                     ) : (
//                       <div className="no-photo">No Photo</div>
//                     )}
//                     <div className="cast-info">
//                       <h4>{person.name}</h4>
//                       <p>{person.character}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "videos" && movie.videos?.results && (
//             <div className="videos">
//               <h2>Videos</h2>
//               <div className="video-grid">
//                 {movie.videos.results
//                   .filter((video) => video.site === "YouTube")
//                   .map((video) => (
//                     <div key={video.key} className="video-item">
//                       <iframe
//                         width="100%"
//                         height="200"
//                         src={`https://www.youtube.com/embed/${video.key}`}
//                         title={video.name}
//                         frameBorder="0"
//                         allowFullScreen
//                       ></iframe>
//                       <p>{video.name}</p>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;
