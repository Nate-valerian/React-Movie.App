import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MovieCard = ({ movie }) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // Format movie title to match your screenshot style
  const formattedTitle = movie.title || "Unknown Movie";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="poster-container">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
              loading="lazy"
            />
          ) : (
            <div className="no-poster">
              <span>No Image</span>
            </div>
          )}

          <div className="movie-rating">
            <span className="star">⭐</span>
            <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>
        </div>

        <div className="movie-info">
          <h3 className="movie-title">{formattedTitle}</h3>
          <p className="movie-year">{releaseYear}</p>

          <div className="movie-actions">
            <button className="details-button">View Details →</button>
          </div>
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
};

export default MovieCard;

// import { Link } from 'react-router-dom'
// import React from 'react'

// interface MovieCardProps {
//   movie: {
//     id: number
//     title: string
//     poster_path: string
//     vote_average: number
//     release_date?: string
//     overview?: string
//   }
// }

// const MovieCard = ({ movie }: MovieCardProps) => {
//   const releaseYear = movie.release_date
//     ? new Date(movie.release_date).getFullYear()
//     : 'N/A'

//   return (
//     <Link to={`/movie/${movie.id}`} className="movie-card-link">
//       <div className="movie-card">
//         <div className="poster-container">
//           {movie.poster_path ? (
//             <img
//               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//               alt={movie.title}
//               className="movie-poster"
//               loading="lazy"
//             />
//           ) : (
//             <div className="no-poster">
//               <span>No Image</span>
//             </div>
//           )}

//           <div className="movie-rating">
//             <span className="star">⭐</span>
//             <span>{movie.vote_average.toFixed(1)}</span>
//           </div>
//         </div>

//         <div className="movie-info">
//           <h3 className="movie-title">{movie.title}</h3>
//           <p className="movie-year">{releaseYear}</p>

//           {movie.overview && (
//             <p className="movie-overview">
//               {movie.overview.length > 100
//                 ? `${movie.overview.substring(0, 100)}...`
//                 : movie.overview}
//             </p>
//           )}

//           <div className="movie-actions">
//             <button className="details-button">
//               View Details →
//             </button>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

// export default MovieCard

// import React from 'react';

// const MovieCard = ({
//   movie: { title, vote_average, poster_path, release_date, original_language },
// }) => {
//   return (
//     <div className="movie-card">
//       <img
//         src={
//           poster_path
//             ? `https://image.tmdb.org/t/p/w500/${poster_path}`
//             : '/no-movie.png'
//         }
//         alt={title}
//       />

//       <div className="mt-4">
//         <h3>{title}</h3>

//         <div className="content">
//           <div className="rating">
//             <img src="star.svg" alt="Star Icon" />
//             <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
//           </div>

//           <span>•</span>
//           <p className="lang">{original_language}</p>

//           <span>•</span>
//           <p className="year">
//             {release_date ? release_date.split('-')[0] : 'N/A'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MovieCard;
