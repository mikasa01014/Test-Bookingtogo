import { movieRepository } from "../../repositories/movieRepository";
import { Movie, MovieResponse } from "../../types/movie";
import { useMovieStore } from "../movieStore";

jest.mock("../../repositories/movieRepository");

const mockedGetPopular =
  movieRepository.getPopularMovies as jest.MockedFunction<
    typeof movieRepository.getPopularMovies
  >;
const mockedSearch = movieRepository.searchMovies as jest.MockedFunction<
  typeof movieRepository.searchMovies
>;

function buildMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: "Test Movie",
    overview: "overview",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-01",
    vote_average: 7.5,
    vote_count: 100,
    genre_ids: [],
    popularity: 10,
    ...overrides,
  };
}

function buildPage(overrides: Partial<MovieResponse> = {}): MovieResponse {
  return {
    page: 1,
    results: [buildMovie()],
    total_pages: 1,
    total_results: 1,
    ...overrides,
  };
}

describe("useMovieStore", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useMovieStore.setState({
      movies: [],
      mode: "popular",
      searchQuery: "",
      page: 0,
      totalPages: 1,
      isLoadingMore: false,
      isLoading: false,
      error: null,
      isRefreshing: false,
    });
  });

  describe("loadPopularMovies", () => {
    it("populates movies and pagination info on success", async () => {
      mockedGetPopular.mockResolvedValue(
        buildPage({
          results: [buildMovie({ id: 1 }), buildMovie({ id: 2 })],
          total_pages: 5,
        }),
      );

      await useMovieStore.getState().loadPopularMovies();

      const state = useMovieStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.movies).toHaveLength(2);
      expect(state.mode).toBe("popular");
      expect(state.totalPages).toBe(5);
      expect(mockedGetPopular).toHaveBeenCalledWith(1);
    });

    it("sets an AppError on failure (no internet)", async () => {
      mockedGetPopular.mockRejectedValue({
        isAxiosError: true,
        response: undefined,
      });

      await useMovieStore.getState().loadPopularMovies();

      expect(useMovieStore.getState().error?.kind).toBe("network");
      expect(useMovieStore.getState().movies).toEqual([]);
    });
  });

  describe("searchMovies", () => {
    it('switches mode to "search" and fetches results for a non-empty query', async () => {
      mockedSearch.mockResolvedValue(
        buildPage({ results: [buildMovie({ id: 42, title: "Dune" })] }),
      );

      await useMovieStore.getState().searchMovies("dune");

      const state = useMovieStore.getState();
      expect(state.mode).toBe("search");
      expect(state.searchQuery).toBe("dune");
      expect(state.movies[0].title).toBe("Dune");
      expect(mockedSearch).toHaveBeenCalledWith("dune", 1);
    });

    it("falls back to loadPopularMovies when the query is empty/whitespace", async () => {
      mockedGetPopular.mockResolvedValue(buildPage());

      await useMovieStore.getState().searchMovies("   ");

      expect(mockedSearch).not.toHaveBeenCalled();
      expect(mockedGetPopular).toHaveBeenCalledWith(1);
      expect(useMovieStore.getState().mode).toBe("popular");
    });
  });

  describe("loadNextPage", () => {
    it("appends the next page and advances the page counter", async () => {
      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 1 })],
          page: 1,
          total_pages: 3,
        }),
      );
      await useMovieStore.getState().loadPopularMovies();

      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 2 })],
          page: 2,
          total_pages: 3,
        }),
      );
      await useMovieStore.getState().loadNextPage();

      const state = useMovieStore.getState();
      expect(state.movies.map((m) => m.id)).toEqual([1, 2]);
      expect(state.page).toBe(2);
    });

    it("does nothing once the last page has been reached", async () => {
      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 1 })],
          page: 1,
          total_pages: 1,
        }),
      );
      await useMovieStore.getState().loadPopularMovies();

      await useMovieStore.getState().loadNextPage();

      expect(mockedGetPopular).toHaveBeenCalledTimes(1);
    });

    it("silently stops (keeps existing movies) if fetching the next page fails", async () => {
      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 1 })],
          page: 1,
          total_pages: 3,
        }),
      );
      await useMovieStore.getState().loadPopularMovies();

      mockedGetPopular.mockRejectedValueOnce({
        isAxiosError: true,
        response: undefined,
      });
      await useMovieStore.getState().loadNextPage();

      const state = useMovieStore.getState();
      expect(state.isLoadingMore).toBe(false);
      expect(state.error).toBeNull();
      expect(state.movies).toHaveLength(1);
    });
  });

  describe("refresh", () => {
    it("reloads the first page and replaces the movie list, using isRefreshing not isLoading", async () => {
      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 1 })],
          page: 1,
          total_pages: 3,
        }),
      );
      await useMovieStore.getState().loadPopularMovies();

      mockedGetPopular.mockResolvedValueOnce(
        buildPage({
          results: [buildMovie({ id: 99, title: "Fresh Movie" })],
          page: 1,
          total_pages: 3,
        }),
      );

      const promise = useMovieStore.getState().refresh();
      expect(useMovieStore.getState().isRefreshing).toBe(true);
      expect(useMovieStore.getState().isLoading).toBe(false);

      await promise;

      const state = useMovieStore.getState();
      expect(state.isRefreshing).toBe(false);
      expect(state.movies).toEqual([
        expect.objectContaining({ id: 99, title: "Fresh Movie" }),
      ]);
    });

    it("refreshes the current search query when in search mode", async () => {
      mockedSearch.mockResolvedValueOnce(
        buildPage({ results: [buildMovie({ id: 1 })] }),
      );
      await useMovieStore.getState().searchMovies("dune");

      mockedSearch.mockResolvedValueOnce(
        buildPage({ results: [buildMovie({ id: 2 })] }),
      );
      await useMovieStore.getState().refresh();

      expect(mockedSearch).toHaveBeenLastCalledWith("dune", 1);
    });

    it("surfaces an error if the refresh request fails", async () => {
      mockedGetPopular.mockResolvedValueOnce(buildPage());
      await useMovieStore.getState().loadPopularMovies();

      mockedGetPopular.mockRejectedValueOnce({
        isAxiosError: true,
        response: undefined,
      });
      await useMovieStore.getState().refresh();

      expect(useMovieStore.getState().isRefreshing).toBe(false);
      expect(useMovieStore.getState().error?.kind).toBe("network");
    });
  });

  describe("retry", () => {
    it("retries the last search query when in search mode", async () => {
      mockedSearch.mockRejectedValueOnce({
        isAxiosError: true,
        response: undefined,
      });
      await useMovieStore.getState().searchMovies("inception");
      expect(useMovieStore.getState().error).not.toBeNull();

      mockedSearch.mockResolvedValueOnce(buildPage());
      await useMovieStore.getState().retry();

      expect(useMovieStore.getState().error).toBeNull();
      expect(mockedSearch).toHaveBeenLastCalledWith("inception", 1);
    });
  });
});
