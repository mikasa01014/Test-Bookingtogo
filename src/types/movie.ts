export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface MovieResponse {
  page: number;
  result: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
}

export type AppErrorKind =
  | "network"
  | "not_found"
  | "server"
  | "unauthorized"
  | "unknown";

export interface AppError {
  kind: AppErrorKind;
  message: string;
}
