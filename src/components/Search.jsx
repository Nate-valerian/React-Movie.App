import React from "react";

import PropTypes from "prop-types";

const Search = ({ searchTerm, setSearchTerm, fetchMovies }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
};

Search.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  fetchMovies: PropTypes.func.isRequired,
};

export default Search;

// import PropTypes from "prop-types";

// const Search = ({ searchTerm, setSearchTerm, fetchMovies }) => {
//   return (
//     <div className="search">
//       <div>
//         <img src="search.svg" alt="search" />

//         <input
//           type="text"
//           placeholder="Search through thousands of movies"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };
// export default Search;
