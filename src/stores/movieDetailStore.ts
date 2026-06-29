import { create } from "zustand";
import { toAppError } from "../api/clients";
import { getMovieDetail } from "../api/movieService";
import { AppError, MovieDetail } from "../types/movie";

interface MovieDetailStore {
  movie: MovieDetail | null;
  isLoading: boolean;
  error: AppError | null;
  loadMovieDetail: (movieId: number) => Promise<void>;
  reset: () => void;
}

export const useMovieDetailStore = create<MovieDetailStore>((set) => ({
  movie: null,
  isLoading: false,
  error: null,

  loadMovieDetail: async (movieId: number) => {
    set({ isLoading: true, error: null });
    try {
      const movie = await getMovieDetail(movieId);
      set({ movie, isLoading: false });
    } catch (err) {
      set({ error: toAppError(err), isLoading: false });
    }
  },

  reset: () => set({ movie: null, isLoading: false, error: null }),
}));
