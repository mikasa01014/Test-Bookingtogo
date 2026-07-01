import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

const THEME_PREFERENCE_KEY = "movie-explorer:theme-preference";

interface ThemeStore {
  preference: ThemePreference;
  isLoaded: boolean;
  loadPreference: () => Promise<void>;
  setPreference: (preference: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: "system",
  isLoaded: false,

  loadPreference: async () => {
    const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    const preference: ThemePreference =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    set({ preference, isLoaded: true });
  },

  setPreference: async (preference: ThemePreference) => {
    set({ preference });
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
  },
}));
