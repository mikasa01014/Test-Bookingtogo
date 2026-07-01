import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { MovieCard } from "../components/MovieCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { useMovieNavigation } from "../navigations/useMovieNavigation";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useTheme } from "../themes/ThemeProvider";
import { FavoriteMovie, Movie } from "../types/movie";
import { GLASS_TAB_BAR_HEIGHT } from "../utils/constants/config";

export function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, spacing, typography } = useTheme();
  const { navigateToDetail } = useMovieNavigation();

  const favorites = useFavoriteStore((store) => store.favorites);
  const isLoaded = useFavoriteStore((store) => store.isLoaded);
  const loadFavorites = useFavoriteStore((store) => store.loadFavorites);

  useEffect(() => {
    if (!isLoaded) {
      loadFavorites();
    }
  }, [isLoaded, loadFavorites]);

  const movies = useMemo<Movie[]>(
    () =>
      favorites.map((favorite: FavoriteMovie) => ({
        id: favorite.id,
        title: favorite.title,
        overview: "",
        poster_path: favorite.poster_path,
        backdrop_path: null,
        release_date: favorite.release_date,
        vote_average: favorite.vote_average,
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
      })),
    [favorites],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Movie; index: number }) => (
      <MovieCard
        movie={item}
        onPress={navigateToDetail}
        isFavorite
        index={index}
      />
    ),
    [navigateToDetail],
  );

  if (!isLoaded) {
    return <LoadingView message="Loading my favorites" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <Text style={[typography.h1, { color: colors.text }]}>Favorites</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          {movies.length > 0
            ? `${movies.length} movie${movies.length === 1 ? "" : "s"} saved`
            : "Movies you favorite will show up here"}
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <Text
            style={[
              typography.small,
              {
                color: colors.textTertiary,
                marginBottom: spacing.sm,
                letterSpacing: 0.5,
              },
            ]}
          >
            APPEARANCE
          </Text>
          <ThemeToggle />
        </View>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.sm,
            paddingBottom: GLASS_TAB_BAR_HEIGHT + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            message="Tap the heart icon on any movie to save it here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
});
