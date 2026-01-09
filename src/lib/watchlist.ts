import { supabase } from "./supabase";

type MovieLite = {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

export async function isInWatchlist(movieId: number) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return false;

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function addToWatchlist(movie: MovieLite) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");

  const releaseYear = movie.release_date
    ? Number(movie.release_date.split("-")[0])
    : null;

  const { error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    release_year: releaseYear,
    vote_average: movie.vote_average ?? null,
  });

  if (error) throw error;
}

export async function removeFromWatchlist(movieId: number) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId);

  if (error) throw error;
}
