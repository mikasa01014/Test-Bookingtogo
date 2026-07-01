import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStore } from "../themeStore";

describe("useThemeStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useThemeStore.setState({ preference: "system", isLoaded: false });
  });

  it('defaults to "system" before loading', () => {
    const state = useThemeStore.getState();
    expect(state.preference).toBe("system");
    expect(state.isLoaded).toBe(false);
  });

  it('loadPreference defaults to "system" when nothing is stored yet', async () => {
    await useThemeStore.getState().loadPreference();

    const state = useThemeStore.getState();
    expect(state.preference).toBe("system");
    expect(state.isLoaded).toBe(true);
  });

  it("setPreference updates state and persists to AsyncStorage", async () => {
    await useThemeStore.getState().setPreference("dark");

    expect(useThemeStore.getState().preference).toBe("dark");

    const stored = await AsyncStorage.getItem(
      "movie-explorer:theme-preference",
    );
    expect(stored).toBe("dark");
  });

  it("loadPreference reads back a previously persisted preference", async () => {
    await useThemeStore.getState().setPreference("light");
    useThemeStore.setState({ preference: "system", isLoaded: false });

    await useThemeStore.getState().loadPreference();

    expect(useThemeStore.getState().preference).toBe("light");
  });

  it('falls back to "system" if AsyncStorage contains an invalid value', async () => {
    await AsyncStorage.setItem(
      "movie-explorer:theme-preference",
      "not-a-real-theme",
    );

    await useThemeStore.getState().loadPreference();

    expect(useThemeStore.getState().preference).toBe("system");
  });
});
