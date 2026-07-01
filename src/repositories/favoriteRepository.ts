import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from "../api/favoritesService";
import { FavoritableMovie, FavoriteMovie } from "../types/movie";

export const favoriteRepository = {
  getAll(): Promise<FavoriteMovie[]> {
    return getFavorites();
  },

  add(movie: FavoritableMovie): Promise<void> {
    return saveFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: Date.now(),
    });
  },

  remove(movieId: number): Promise<void> {
    return removeFavorite(movieId);
  },
};
