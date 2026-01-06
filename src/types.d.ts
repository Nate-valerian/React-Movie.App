// src/types.d.ts
declare module "*.jsx" {
  import React from "react";
  const Component: React.ComponentType<any>;
  export default Component;
}

// Declare types for your components
declare module "./components/Search.jsx" {
  import React from "react";
  const Search: React.ComponentType<{
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    fetchMovies: (query: string) => Promise<void>;
  }>;
  export default Search;
}

declare module "./components/Spinner.jsx" {
  import React from "react";
  const Spinner: React.ComponentType;
  export default Spinner;
}

declare module "./components/MovieCard.jsx" {
  import React from "react";
  const MovieCard: React.ComponentType<{
    movie: any;
  }>;
  export default MovieCard;
}

declare module "./appwrite.js" {
  export const getTrendingMovies: () => Promise<any[]>;
  export const updateSearchCount: (
    searchTerm: string,
    movie: any
  ) => Promise<void>;
}

// Movie type
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  [key: string]: any;
}

// Appwrite document type
interface AppwriteDocument {
  $id: string;
  searchTerm: string;
  title: string;
  poster_url: string;
  count: number;
  movie_id: number;
  [key: string]: any;
}
