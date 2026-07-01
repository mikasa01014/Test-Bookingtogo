import { useEffect } from "react";
import { getImageUrl } from "../api/clients";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useMovieDetailStore } from "../stores/movieDetailStore";

export function useMovieDetailScreenData(movieId: number) {
  const movie = useMovieDetailStore((store) => store.movie);
  const isLoading = useMovieDetailStore((store) => store.isLoading);
  const error = useMovieDetailStore((store) => store.error);
  const loadMovieDetail = useMovieDetailStore((store) => store.loadMovieDetail);
  const reset = useMovieDetailStore((store) => store.reset);

  const isFavorite = useFavoriteStore((store) =>
    store.favoriteIds.has(movieId),
  );
  const toggleFavorite = useFavoriteStore((store) => store.toggleFavorite);

  useEffect(() => {
    loadMovieDetail(movieId);
    return () => reset();
  }, [movieId, loadMovieDetail, reset]);

  const backdropUrl = movie ? getImageUrl(movie.backdrop_path, "w1280") : null;

  return {
    movie,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    backdropUrl,
    retry: () => loadMovieDetail(movieId),
  };
}
