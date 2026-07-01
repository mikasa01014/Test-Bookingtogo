import { create } from "zustand";
import { toAppError } from "../api/clients";
import { movieRepository } from "../repositories/movieRepository";
import { AppError, Movie } from "../types/movie";

type ListMode = "popular" | "search";

interface MovieStore {
  movies: Movie[];
  mode: ListMode;
  searchQuery: string;

  page: number;
  totalPages: number;
  isLoadingMore: boolean;

  isLoading: boolean;
  error: AppError | null;

  isRefreshing: boolean;

  loadPopularMovies: () => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  loadNextPage: () => Promise<void>;
  clearSearch: () => Promise<void>;
  retry: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  mode: "popular",
  searchQuery: "",
  page: 0,
  totalPages: 1,
  isLoadingMore: false,
  isLoading: false,
  error: null,
  isRefreshing: false,

  loadPopularMovies: async () => {
    set({
      isLoading: true,
      error: null,
      mode: "popular",
      searchQuery: "",
    });

    try {
      const result = await movieRepository.getPopularMovies(1);
      set({
        movies: result.results,
        page: result.page,
        totalPages: result.total_pages,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: toAppError(err),
        isLoading: false,
      });
    }
  },

  searchMovies: async (query: string) => {
    const trimmed = query.trim();
    set({ searchQuery: query });

    if (trimmed.length === 0) {
      await get().loadPopularMovies();
      return;
    }

    set({
      isLoading: true,
      error: null,
      mode: "search",
    });

    try {
      const result = await movieRepository.searchMovies(trimmed, 1);
      set({
        movies: result.results,
        page: result.page,
        totalPages: result.total_pages,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: toAppError(err),
        isLoading: false,
      });
    }
  },

  loadNextPage: async () => {
    const { page, totalPages, isLoadingMore, isLoading, mode, searchQuery } =
      get();

    if (isLoadingMore || isLoading) return;
    if (page >= totalPages) return;

    set({ isLoadingMore: true });
    try {
      const nextPage = page + 1;
      const result =
        mode === "search"
          ? await movieRepository.searchMovies(searchQuery.trim(), nextPage)
          : await movieRepository.getPopularMovies(nextPage);

      set((state) => ({
        movies: [...state.movies, ...result.results],
        page: result.page,
        totalPages: result.total_pages,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  clearSearch: async () => {
    await get().loadPopularMovies();
  },

  retry: async () => {
    const { mode, searchQuery } = get();
    if (mode === "search" && searchQuery.trim().length > 0) {
      await get().searchMovies(searchQuery);
    } else {
      await get().loadPopularMovies();
    }
  },

  refresh: async () => {
    const { mode, searchQuery } = get();
    set({ isRefreshing: true, error: null });
    try {
      const result =
        mode === "search" && searchQuery.trim().length > 0
          ? await movieRepository.searchMovies(searchQuery.trim(), 1)
          : await movieRepository.getPopularMovies(1);

      set({
        movies: result.results,
        page: result.page,
        totalPages: result.total_pages,
        isRefreshing: false,
      });
    } catch (err) {
      set({
        error: toAppError(err),
        isRefreshing: false,
      });
    }
  },
}));
