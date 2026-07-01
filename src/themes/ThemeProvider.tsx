import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  ColorPalette,
  darkPalette,
  lightPalette,
  radius,
  spacing,
  typography,
} from "./theme";
import { useThemeStore } from "./themeStore";

export type ResolvedScheme = "light" | "dark";

interface ThemeContextValue {
  colors: ColorPalette;
  scheme: ResolvedScheme;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((store) => store.preference);

  const scheme: ResolvedScheme = useMemo(() => {
    if (preference === "system") {
      return systemScheme === "light" ? "light" : "dark";
    }
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: scheme === "light" ? lightPalette : darkPalette,
      scheme,
      spacing,
      radius,
      typography,
    }),
    [scheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be used within a <ThemeProvider>");
  }
  return ctx;
}
