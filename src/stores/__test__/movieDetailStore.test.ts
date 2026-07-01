import { movieRepository } from "../../repositories/movieRepository";
import { MovieDetail } from "../../types/movie";
import { useMovieDetailStore } from "../movieDetailStore";

jest.mock("../../repositories/movieRepository");

const mockedGetDetail = movieRepository.getMovieDetail as jest.MockedFunction<
  typeof movieRepository.getMovieDetail
>;

function buildMovieDetail(overrides: Partial<MovieDetail> = {}): MovieDetail {
  return {
    id: 1,
    title: "Test Movie",
    overview: "overview",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-01",
    vote_average: 7.5,
    vote_count: 100,
    popularity: 10,
    genres: [{ id: 1, name: "Drama" }],
    runtime: 120,
    tagline: "A tagline",
    ...overrides,
  };
}

describe("useMovieDetailStore", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useMovieDetailStore.setState({
      movie: null,
      isLoading: false,
      error: null,
    });
  });

  it("loads and stores the movie detail on success", async () => {
    mockedGetDetail.mockResolvedValue(
      buildMovieDetail({ id: 99, title: "Dune" }),
    );

    await useMovieDetailStore.getState().loadMovieDetail(99);

    const state = useMovieDetailStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.movie?.title).toBe("Dune");
    expect(mockedGetDetail).toHaveBeenCalledWith(99);
  });

  it("sets isLoading to true while the request is in-flight", () => {
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    useMovieDetailStore.getState().loadMovieDetail(1);

    expect(useMovieDetailStore.getState().isLoading).toBe(true);
  });

  it("stores an AppError and clears the movie on failure", async () => {
    mockedGetDetail.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: {} },
    });

    await useMovieDetailStore.getState().loadMovieDetail(404);

    const state = useMovieDetailStore.getState();
    expect(state.error?.kind).toBe("not_found");
    expect(state.movie).toBeNull();
  });

  it("resets state back to initial values", async () => {
    mockedGetDetail.mockResolvedValue(buildMovieDetail());
    await useMovieDetailStore.getState().loadMovieDetail(1);
    expect(useMovieDetailStore.getState().movie).not.toBeNull();

    useMovieDetailStore.getState().reset();

    const state = useMovieDetailStore.getState();
    expect(state.movie).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
