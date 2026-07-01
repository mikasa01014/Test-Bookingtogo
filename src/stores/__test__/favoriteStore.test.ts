import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritableMovie } from "../../types/movie";
import { useFavoriteStore } from "../favoriteStore";

function buildMovie(
  overrides: Partial<FavoritableMovie> = {},
): FavoritableMovie {
  return {
    id: 1,
    title: "Test Movie",
    poster_path: "/poster.jpg",
    release_date: "2024-01-01",
    vote_average: 7.5,
    ...overrides,
  };
}

describe("useFavoriteStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useFavoriteStore.setState({
      favoriteIds: new Set(),
      favorites: [],
      isLoaded: false,
    });
  });

  it("starts with no favorites loaded", () => {
    const state = useFavoriteStore.getState();
    expect(state.isLoaded).toBe(false);
    expect(state.favorites).toEqual([]);
    expect(state.favoriteIds.size).toBe(0);
  });

  it("loadFavorites populates favorites and favoriteIds from AsyncStorage", async () => {
    await useFavoriteStore
      .getState()
      .toggleFavorite(buildMovie({ id: 1, title: "Dune" }));
    useFavoriteStore.setState({ isLoaded: false });

    await useFavoriteStore.getState().loadFavorites();

    const state = useFavoriteStore.getState();
    expect(state.isLoaded).toBe(true);
    expect(state.favorites).toHaveLength(1);
    expect(state.favoriteIds.has(1)).toBe(true);
  });

  it("toggleFavorite adds a movie that is not yet favorited", async () => {
    await useFavoriteStore
      .getState()
      .toggleFavorite(buildMovie({ id: 7, title: "Arrival" }));

    const state = useFavoriteStore.getState();
    expect(state.isFavorite(7)).toBe(true);
    expect(state.favorites[0].title).toBe("Arrival");
  });

  it("toggleFavorite removes a movie that is already favorited", async () => {
    const movie = buildMovie({ id: 7 });
    await useFavoriteStore.getState().toggleFavorite(movie);
    expect(useFavoriteStore.getState().isFavorite(7)).toBe(true);

    await useFavoriteStore.getState().toggleFavorite(movie);

    expect(useFavoriteStore.getState().isFavorite(7)).toBe(false);
  });

  it("keeps the most recently added favorite first", async () => {
    await useFavoriteStore
      .getState()
      .toggleFavorite(buildMovie({ id: 1, title: "First" }));
    await new Promise((r) => setTimeout(r, 2));
    await useFavoriteStore
      .getState()
      .toggleFavorite(buildMovie({ id: 2, title: "Second" }));

    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites[0].title).toBe("Second");
    expect(favorites[1].title).toBe("First");
  });

  it("isFavorite returns false for a movie that was never favorited", () => {
    expect(useFavoriteStore.getState().isFavorite(999)).toBe(false);
  });

  it("works the same when called with a MovieDetail-shaped object", async () => {
    const movieDetailLike = {
      ...buildMovie({ id: 55, title: "From Detail Screen" }),
      genres: [{ id: 1, name: "Drama" }],
      runtime: 120,
      tagline: "tagline",
      overview: "overview",
      backdrop_path: null,
      vote_count: 10,
      popularity: 1,
    };

    await useFavoriteStore.getState().toggleFavorite(movieDetailLike);

    expect(useFavoriteStore.getState().isFavorite(55)).toBe(true);
  });
});
