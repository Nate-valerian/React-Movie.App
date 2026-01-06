import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

// Initialize Client
const client = new Client()
  .setEndpoint(ENDPOINT) // Use the correct endpoint from env
  .setProject(PROJECT_ID);

const database = new Databases(client);

// Helper function to handle API errors
// const handleAppwriteError = (error) => {
//   console.error("Appwrite Error:", error);
//   throw error; // Re-throw for the calling function to handle
// };

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        title: movie.title, // Add title for display
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// export const getTrendingMovies = async () => {
//   try {
//     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
//       Query.limit(5),
//       Query.orderDesc("count"),
//     ]);

//     return result?.documents || [];
//   } catch (error) {
//     handleAppwriteError(error);
//     return []; // Return empty array to prevent crashes
//   }
// };

export const getTrendingMovies = async () => {
  try {
    console.log("Querying Appwrite for trending movies...");

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.greaterThan("count", 0),
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    console.log("Raw trending result:", result);

    // Detailed logging of each document
    if (result.documents && result.documents.length > 0) {
      console.log("=== Document Details ===");
      result.documents.forEach((doc, index) => {
        console.log(`Document ${index + 1}:`, {
          id: doc.$id,
          searchTerm: doc.searchTerm,
          title: doc.title,
          count: doc.count,
          poster_url: doc.poster_url,
          movie_id: doc.movie_id,
          allKeys: Object.keys(doc),
        });
      });
    } else {
      console.log("No documents found with count > 0");
    }

    return result?.documents || [];
  } catch (error) {
    console.error("Error in getTrendingMovies:", error);
    return [];
  }
};

// export const getTrendingMovies = async () => {
//   try {
//     console.log("Fetching trending (most searched) movies...");

//     // Get documents with count > 0, sorted by count descending
//     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
//       Query.greaterThan("count", 0), // Only get documents that have been searched
//       Query.orderDesc("count"), // Most searched first
//       Query.limit(5), // Top 5
//     ]);

//     console.log("Trending movies found:", result?.documents?.length || 0);

//     // Log each movie for debugging
//     if (result.documents && result.documents.length > 0) {
//       console.log("Trending movies list:");
//       result.documents.forEach((doc, index) => {
//         console.log(
//           `${index + 1}. "${doc.searchTerm}" - Searched ${doc.count} times`
//         );
//       });
//     }

//     return result?.documents || [];
//   } catch (error) {
//     console.error("Error fetching trending movies:", error);
//     return []; // Return empty array on error
//   }
// };
