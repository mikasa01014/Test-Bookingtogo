import {
  getMovieDetail,
  getPopularMovies,
  searchMovies,
} from "../api/movieService";
import { MovieDetail, MovieResponse } from "../types/movie";

export const movieRepository = {
  getPopularMovies(page: number): Promise<MovieResponse> {
    return getPopularMovies(page);
  },

  searchMovies(query: string, page: number): Promise<MovieResponse> {
    return searchMovies(query, page);
  },

  getMovieDetail(movieId: number): Promise<MovieDetail> {
    return getMovieDetail(movieId);
  },
};
