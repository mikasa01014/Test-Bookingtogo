import { create } from "zustand";
import { favoriteRepository } from "../repositories/favoriteRepository";
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
    const favorites = await favoriteRepository.getAll();
    set({
      favorites,
      favoriteIds: new Set(favorites.map((favorite) => favorite.id)),
      isLoaded: true,
    });
  },

  toggleFavorite: async (movie: FavoritableMovie) => {
    const isCurrentlyFavorite = get().favoriteIds.has(movie.id);

    if (isCurrentlyFavorite) {
      await favoriteRepository.remove(movie.id);
    } else {
      await favoriteRepository.add(movie);
    }

    await get().loadFavorites();
  },

  isFavorite: (movieId: number) => get().favoriteIds.has(movieId),
}));
