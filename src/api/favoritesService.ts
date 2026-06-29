import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteMovie } from "../types/movie";

const FAVORITES_KEY = "movie-explorer:favorites";

export async function getFavorites(): Promise<FavoriteMovie[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    const parsed: FavoriteMovie[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.addedAt - a.addedAt);
  } catch {
    return [];
  }
}

export async function saveFavorite(favorite: FavoriteMovie): Promise<void> {
  const current = await getFavorites();
  const withoutExisting = current.filter((filter) => filter.id !== favorite.id);
  const updated = [favorite, ...withoutExisting];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function removeFavorite(movieId: number): Promise<void> {
  const current = await getFavorites();
  const updated = current.filter((filter) => filter.id !== movieId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}
