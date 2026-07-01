import * as favoritesStorage from "../../api/favoritesService";
import { FavoritableMovie, FavoriteMovie } from "../../types/movie";
import { favoriteRepository } from "../favoriteRepository";

jest.mock("../../api/favoritesService");

const mockedGetFavorites = favoritesStorage.getFavorites as jest.MockedFunction<
  typeof favoritesStorage.getFavorites
>;
const mockedSaveFavorite = favoritesStorage.saveFavorite as jest.MockedFunction<
  typeof favoritesStorage.saveFavorite
>;
const mockedRemoveFavorite =
  favoritesStorage.removeFavorite as jest.MockedFunction<
    typeof favoritesStorage.removeFavorite
  >;

describe("favoriteRepository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("getAll delegates to getFavorites", async () => {
    const favorites: FavoriteMovie[] = [
      {
        id: 1,
        title: "Dune",
        poster_path: null,
        release_date: "2021",
        vote_average: 8,
        addedAt: 1,
      },
    ];
    mockedGetFavorites.mockResolvedValue(favorites);

    const result = await favoriteRepository.getAll();

    expect(result).toBe(favorites);
  });

  it("add stamps the current time as addedAt and delegates to saveFavorite", async () => {
    const movie: FavoritableMovie = {
      id: 7,
      title: "Arrival",
      poster_path: "/poster.jpg",
      release_date: "2016-11-11",
      vote_average: 7.9,
    };

    await favoriteRepository.add(movie);

    expect(mockedSaveFavorite).toHaveBeenCalledWith({
      id: 7,
      title: "Arrival",
      poster_path: "/poster.jpg",
      release_date: "2016-11-11",
      vote_average: 7.9,
      addedAt: 123456789,
    });
  });

  it("remove delegates to removeFavorite with the movie id", async () => {
    await favoriteRepository.remove(99);

    expect(mockedRemoveFavorite).toHaveBeenCalledWith(99);
  });
});
