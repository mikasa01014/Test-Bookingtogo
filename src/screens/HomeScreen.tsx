import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";
import { EmptyState } from "../components/EmptyState";
import { ErrorView } from "../components/ErrorView";
import { ListFooterLoader } from "../components/ListFooterLoader";
import { LoadingView } from "../components/LoadingView";
import { MovieCard } from "../components/MovieCard";
import { PullToRefreshList } from "../components/PullToRefreshList";
import { SearchBar } from "../components/SearchBar";
import { TabParamList } from "../navigations/types";
import { useMovieNavigation } from "../navigations/useMovieNavigation";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useMovieStore } from "../stores/movieStore";
import { useTheme } from "../themes/ThemeProvider";
import { Movie } from "../types/movie";
import { GLASS_TAB_BAR_HEIGHT } from "../utils/constants/config";

const SEARCH_DEBOUNCE_MS = 450;

type HomeNavProps = NativeStackNavigationProp<TabParamList, "HomeTab">;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProps>();
  const insets = useSafeAreaInsets();
  const { colors, spacing, typography } = useTheme();
  const { navigateToDetail } = useMovieNavigation();

  const movies = useMovieStore((store) => store.movies);
  const mode = useMovieStore((store) => store.mode);
  const searchQuery = useMovieStore((store) => store.searchQuery);
  const isLoading = useMovieStore((store) => store.isLoading);
  const isLoadingMore = useMovieStore((store) => store.isLoadingMore);
  const error = useMovieStore((store) => store.error);
  const loadPopularMovies = useMovieStore((store) => store.loadPopularMovies);
  const searchMovies = useMovieStore((store) => store.searchMovies);
  const loadNextPage = useMovieStore((store) => store.loadNextPage);
  const clearSearch = useMovieStore((store) => store.clearSearch);
  const retry = useMovieStore((store) => store.retry);
  const refresh = useMovieStore((store) => store.refresh);
  const isRefreshing = useMovieStore((store) => store.isRefreshing);

  const favoriteIds = useFavoriteStore((store) => store.favoriteIds);

  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  const debounceSearch = useDebouncedCallback((query: string) => {
    searchMovies(query);
  }, SEARCH_DEBOUNCE_MS);

  const handleOnChangeInput = useCallback(
    (input: string) => {
      setInputSearch(input);
      debounceSearch(input);
    },
    [debounceSearch],
  );

  const handleOnClear = useCallback(() => {
    setInputSearch("");
    debounceSearch.cancel();
    clearSearch();
  }, [clearSearch, debounceSearch]);

  const handleOnEndReach = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: Movie; index: number }) => (
      <MovieCard
        movie={item}
        onPress={navigateToDetail}
        isFavorite={favoriteIds.has(item.id)}
        index={index}
      />
    ),
    [navigateToDetail, favoriteIds],
  );

  const emptyList = useMemo(() => {
    if (isLoading) return null;
    if (mode === "search") {
      return (
        <EmptyState
          icon="search-outline"
          title="No Movie Found"
          message={`Sorry, we couldn't find any movies matching "${searchQuery}".`}
        />
      );
    }
    return <EmptyState icon="film-outline" title="No Movies Available" />;
  }, [isLoading, mode, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing.md,
          gap: spacing.xs,
        }}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={[typography.h1, { color: colors.text }]}>
              Movie Exploler
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {mode === "search" ? "Movie Search Result" : "Popular Movie"}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("FavoritesTab")}
            style={[
              styles.favoritesShortcut,
              { backgroundColor: colors.surfaceElevated },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open favorites"
            hitSlop={8}
          >
            <Ionicons name="heart" size={18} color={colors.favorite} />
          </Pressable>
        </View>

        <View style={{ marginTop: spacing.xs }}>
          <SearchBar
            value={inputSearch}
            onChangeText={handleOnChangeInput}
            onClear={handleOnClear}
            placeholder="Search movies title"
          />
        </View>
      </View>

      {isLoading ? (
        <LoadingView message="Getting your movies" />
      ) : error ? (
        <ErrorView error={error} onRetry={retry} />
      ) : (
        <PullToRefreshList
          data={movies}
          keyExtractor={(item: Movie) => String(item.id)}
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
          onEndReached={handleOnEndReach}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={emptyList}
          ListFooterComponent={<ListFooterLoader visible={isLoadingMore} />}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
          testID="movie-list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  favoritesShortcut: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    flexGrow: 1,
  },
});
