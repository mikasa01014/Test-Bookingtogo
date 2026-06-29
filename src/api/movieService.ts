import { MovieDetail, MovieResponse } from "../types/movie";
import { api } from "./clients";

export async function getPopularMovies(page: number): Promise<MovieResponse> {
  const { data } = await api.get<MovieResponse>("/movie/popular", {
    params: {
      page,
    },
  });

  return data;
}

export async function searchMovies(
  query: string,
  page: number,
): Promise<MovieResponse> {
  const { data } = await api.get<MovieResponse>("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
    },
  });

  return data;
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  const { data } = await api.get<MovieDetail>(`/movie/${movieId}`);

  return data;
}
