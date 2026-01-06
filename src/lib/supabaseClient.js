// src/lib/supabaseClient.js
import { supabase } from "./supabase";

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    console.log("🎬 updateSearchCount called with:", {
      searchTerm,
      movieId: movie?.id,
      movieTitle: movie?.title,
    });

    if (!searchTerm || !movie) {
      console.error("❌ Missing searchTerm or movie");
      return;
    }

    // Check if search term already exists
    const { data: existingSearches, error: searchError } = await supabase
      .from("searches")
      .select("*")
      .eq("search_term", searchTerm)
      .limit(1);

    if (searchError) {
      console.error("❌ Error checking existing searches:", searchError);
      return;
    }

    console.log("🔍 Existing searches found:", existingSearches?.length || 0);

    if (existingSearches && existingSearches.length > 0) {
      // Update existing record
      const existing = existingSearches[0];
      console.log("📝 Updating existing record:", {
        id: existing.id,
        currentCount: existing.count,
      });

      const { error: updateError } = await supabase
        .from("searches")
        .update({
          count: existing.count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("❌ Error updating record:", updateError);
      } else {
        console.log("✅ Successfully updated count to:", existing.count + 1);
      }
    } else {
      // Create new record
      console.log("🆕 Creating new record for:", searchTerm);

      const newRecord = {
        search_term: searchTerm,
        count: 1,
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("📋 New record data:", newRecord);

      const { data, error: insertError } = await supabase
        .from("searches")
        .insert([newRecord])
        .select();

      if (insertError) {
        console.error("❌ Error creating record:", insertError);
      } else {
        console.log("✅ Successfully created new search record:", data);
      }
    }
  } catch (error) {
    console.error("💥 Error in updateSearchCount:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    console.log("📊 getTrendingMovies called");

    const { data, error, count } = await supabase
      .from("searches")
      .select("*", { count: "exact" })
      .order("count", { ascending: false })
      .limit(5);

    console.log("🔍 Supabase response:", {
      dataLength: data?.length,
      count,
      error: error?.message,
    });

    if (error) {
      console.error("❌ Error fetching trending movies:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No trending movies found in database");
      return [];
    }

    // Format data
    const formattedData = data.map((item) => ({
      $id: item.id,
      searchTerm: item.search_term,
      title: item.title,
      poster_url: item.poster_url,
      count: item.count,
      movie_id: item.movie_id,
    }));

    console.log("✅ Formatted trending data:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("💥 Error in getTrendingMovies:", error);
    return [];
  }
};

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log("🔌 Testing Supabase connection...");

    const { data, error } = await supabase
      .from("searches")
      .select("count(*)")
      .single();

    if (error) {
      console.error("❌ Supabase connection failed:", error);
      return { success: false, error };
    }

    console.log("✅ Supabase connection successful");
    console.log("📊 Total records in searches:", data.count);

    return { success: true, count: data.count };
  } catch (error) {
    console.error("💥 Error testing connection:", error);
    return { success: false, error };
  }
};

// // src/lib/supabaseClient.js (replace appwrite.js)
// import { supabase } from "./supabase";

// export const updateSearchCount = async (searchTerm, movie) => {
//   try {
//     console.log("Updating search count for:", searchTerm);

//     // Check if search term already exists
//     const { data: existingSearches, error: searchError } = await supabase
//       .from("searches")
//       .select("*")
//       .eq("search_term", searchTerm)
//       .limit(1);

//     if (searchError) {
//       console.error("Error checking existing searches:", searchError);
//       throw searchError;
//     }

//     if (existingSearches && existingSearches.length > 0) {
//       // Update existing record
//       const existing = existingSearches[0];
//       console.log(
//         "Updating existing record:",
//         existing.id,
//         "Count:",
//         existing.count
//       );

//       const { error: updateError } = await supabase
//         .from("searches")
//         .update({
//           count: existing.count + 1,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", existing.id);

//       if (updateError) {
//         console.error("Error updating record:", updateError);
//         throw updateError;
//       }

//       console.log("Successfully updated count to:", existing.count + 1);
//     } else {
//       // Create new record
//       console.log("Creating new record for:", searchTerm);

//       const { error: insertError } = await supabase.from("searches").insert({
//         search_term: searchTerm,
//         count: 1,
//         movie_id: movie.id,
//         title: movie.title,
//         poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       });

//       if (insertError) {
//         console.error("Error creating record:", insertError);
//         throw insertError;
//       }

//       console.log("Successfully created new search record");
//     }
//   } catch (error) {
//     console.error("Error in updateSearchCount:", error);
//     // Don't throw error to prevent breaking the main flow
//   }
// };

// export const getTrendingMovies = async () => {
//   try {
//     console.log("Fetching trending movies from Supabase...");

//     const { data, error } = await supabase
//       .from("searches")
//       .select("*")
//       .order("count", { ascending: false })
//       .limit(5);

//     if (error) {
//       console.error("Error fetching trending movies:", error);
//       throw error;
//     }

//     console.log("Trending movies fetched:", data?.length || 0);

//     // Format data to match your existing Appwrite structure
//     const formattedData = (data || []).map((item) => ({
//       $id: item.id,
//       searchTerm: item.search_term,
//       title: item.title,
//       poster_url: item.poster_url,
//       count: item.count,
//       movie_id: item.movie_id,
//       created_at: item.created_at,
//       updated_at: item.updated_at,
//     }));

//     console.log("Formatted data:", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.error("Error in getTrendingMovies:", error);
//     return []; // Return empty array to prevent crashes
//   }
// };
