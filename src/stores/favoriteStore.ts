import { create } from "zustand";
import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from "../api/favoritesService";
import { FavoritableMovie, FavoriteMovie } from "../types/movie";

interface FavoriteStore {
  favoriteIds: Set<number>;
  favorites: FavoriteMovie[];
  isLoaded: boolean;

  loadFavorites: () => Promise<void>;
  toggleFavorite: (movie: FavoritableMovie) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favoriteIds: new Set(),
  favorites: [],
  isLoaded: false,

  loadFavorites: async () => {
    const favorites = await getFavorites();
    set({
      favorites,
      favoriteIds: new Set(favorites.map((favorite) => favorite.id)),
      isLoaded: true,
    });
  },

  toggleFavorite: async (movie: FavoritableMovie) => {
    const isCurrentlyFavorite = get().favoriteIds.has(movie.id);

    if (isCurrentlyFavorite) {
      await removeFavorite(movie.id);
    } else {
      await saveFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: Date.now(),
      });
    }

    await get().loadFavorites();
  },

  isFavorite: (movieId: number) => get().favoriteIds.has(movieId),
}));
