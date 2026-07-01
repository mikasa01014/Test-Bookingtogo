import * as movieService from "../../api/movieService";
import { MovieDetail, MovieResponse } from "../../types/movie";
import { movieRepository } from "../movieRepository";

jest.mock("../../api/movieService");

const mockedFetchPopular = movieService.getPopularMovies as jest.MockedFunction<
  typeof movieService.getPopularMovies
>;
const mockedSearchMovies = movieService.searchMovies as jest.MockedFunction<
  typeof movieService.searchMovies
>;
const mockedFetchDetail = movieService.getMovieDetail as jest.MockedFunction<
  typeof movieService.getMovieDetail
>;

describe("movieRepository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("getPopularMovies delegates to fetchPopularMovies with the given page", async () => {
    const page: MovieResponse = {
      page: 2,
      results: [],
      total_pages: 5,
      total_results: 100,
    };
    mockedFetchPopular.mockResolvedValue(page);

    const result = await movieRepository.getPopularMovies(2);

    expect(mockedFetchPopular).toHaveBeenCalledWith(2);
    expect(result).toBe(page);
  });

  it("searchMovies delegates to searchMovies with query and page", async () => {
    const page: MovieResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
    mockedSearchMovies.mockResolvedValue(page);

    const result = await movieRepository.searchMovies("dune", 1);

    expect(mockedSearchMovies).toHaveBeenCalledWith("dune", 1);
    expect(result).toBe(page);
  });

  it("getMovieDetail delegates to fetchMovieDetail with the movie id", async () => {
    const detail = { id: 42, title: "Dune" } as MovieDetail;
    mockedFetchDetail.mockResolvedValue(detail);

    const result = await movieRepository.getMovieDetail(42);

    expect(mockedFetchDetail).toHaveBeenCalledWith(42);
    expect(result).toBe(detail);
  });
});
