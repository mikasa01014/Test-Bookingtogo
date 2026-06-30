import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import { EmptyState } from "../components/EmptyState";
import { ErrorView } from "../components/ErrorView";
import { ListFooterLoader } from "../components/ListFooterLoader";
import { LoadingView } from "../components/LoadingView";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";
import { RootStackParamList } from "../navigations/types";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useMovieStore } from "../stores/movieStore";
import { colors, spacing, typography } from "../themes/theme";
import { Movie } from "../types/movie";

const SEARCH_DEBOUNCE_MS = 450;

type HomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProps>();

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

  const handleOnMoviePress = useCallback(
    (movie: Movie) => {
      navigation.navigate("MovieDetail", { movieId: movie.id });
    },
    [navigation],
  );

  const handleOnEndReach = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        movie={item}
        onPress={handleOnMoviePress}
        isFavorite={favoriteIds.has(item.id)}
      />
    ),
    [handleOnMoviePress, favoriteIds],
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movie Exploler</Text>
        <Text style={styles.headerSubtitle}>
          {mode === "search" ? "Movie Search Result" : "Popular Movie"}
        </Text>
        <View style={styles.searchBarWrapper}>
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
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleOnEndReach}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={emptyList}
          ListFooterComponent={<ListFooterLoader visible={isLoadingMore} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  searchBarWrapper: {
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
