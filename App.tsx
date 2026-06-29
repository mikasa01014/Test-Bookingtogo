import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigations/AppNavigator";
import { useFavoriteStore } from "./src/stores/favoriteStore";
import { apiKeyConfig } from "./src/utils/constants/config";

export default function App() {
  const loadFavorites = useFavoriteStore((store) => store.loadFavorites);

  useEffect(() => {
    loadFavorites();

    apiKeyConfig();
  }, [loadFavorites]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
