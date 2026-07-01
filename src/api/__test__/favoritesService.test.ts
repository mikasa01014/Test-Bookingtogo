import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteMovie } from "../../types/movie";
import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from "../favoritesService";

function buildFavorite(overrides: Partial<FavoriteMovie> = {}): FavoriteMovie {
  return {
    id: 1,
    title: "Dune",
    poster_path: "/poster.jpg",
    release_date: "2021-10-22",
    vote_average: 8.0,
    addedAt: Date.now(),
    ...overrides,
  };
}

describe("favoritesStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("returns an empty array when nothing has been saved yet", async () => {
    const favorites = await getFavorites();
    expect(favorites).toEqual([]);
  });

  it("saves a favorite and retrieves it back", async () => {
    const favorite = buildFavorite({ id: 42, title: "Arrival" });
    await saveFavorite(favorite);

    const favorites = await getFavorites();

    expect(favorites).toHaveLength(1);
    expect(favorites[0].title).toBe("Arrival");
  });

  it("does not create duplicate entries when saving the same id twice", async () => {
    await saveFavorite(buildFavorite({ id: 1, title: "First Save" }));
    await saveFavorite(buildFavorite({ id: 1, title: "Updated Save" }));

    const favorites = await getFavorites();

    expect(favorites).toHaveLength(1);
    expect(favorites[0].title).toBe("Updated Save");
  });

  it("removes a favorite by id", async () => {
    await saveFavorite(buildFavorite({ id: 1 }));
    await saveFavorite(buildFavorite({ id: 2 }));

    await removeFavorite(1);

    const favorites = await getFavorites();
    expect(favorites.map((f) => f.id)).toEqual([2]);
  });

  it("sorts favorites with the most recently added first", async () => {
    await saveFavorite(buildFavorite({ id: 1, title: "Older", addedAt: 1000 }));
    await saveFavorite(buildFavorite({ id: 2, title: "Newer", addedAt: 2000 }));

    const favorites = await getFavorites();

    expect(favorites[0].title).toBe("Newer");
    expect(favorites[1].title).toBe("Older");
  });

  it("treats corrupted stored data as an empty list instead of throwing", async () => {
    await AsyncStorage.setItem("movie-explorer:favorites", "not-valid-json{{{");

    const favorites = await getFavorites();

    expect(favorites).toEqual([]);
  });
});
