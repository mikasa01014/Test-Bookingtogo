import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigations/AppNavigator";
import { useFavoriteStore } from "./src/stores/favoriteStore";
import { ThemeProvider, useTheme } from "./src/themes/ThemeProvider";
import { useThemeStore } from "./src/themes/themeStore";
import { apiKeyConfig } from "./src/utils/constants/config";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { scheme } = useTheme();
  const loadFavorites = useFavoriteStore((store) => store.loadFavorites);
  const loadThemePref = useThemeStore((store) => store.loadPreference);

  useEffect(() => {
    loadFavorites();
    loadThemePref();

    apiKeyConfig();
  }, [loadFavorites, loadThemePref]);

  return (
    <>
      <StatusBar style={scheme === "light" ? "dark" : "light"} />
      <AppNavigator />
    </>
  );
}
