import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React, { useEffect, useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getImageUrl } from "../api/clients";
import { ErrorView } from "../components/ErrorView";
import { FavoriteButton } from "../components/FavoriteButton";
import { GenreChip } from "../components/GenreChip";
import { LoadingView } from "../components/LoadingView";
import { RatingBadge } from "../components/RatingBadge";
import { RootStackParamList } from "../navigations/types";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useMovieDetailStore } from "../stores/movieDetailStore";
import { colors, radius, spacing, typography } from "../themes/theme";
import {
  formatRating,
  formatReleaseDate,
  formatRuntime,
} from "../utils/formats";

type MovieDetailRouteProps = RouteProp<RootStackParamList, "MovieDetail">;
type MovieDetailNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "MovieDetail"
>;

export function MovieDetailScreen() {
  const route = useRoute<MovieDetailRouteProps>();
  const navigation = useNavigation<MovieDetailNavigationProps>();
  const { movieId } = route.params;

  const movie = useMovieDetailStore((store) => store.movie);
  const isLoading = useMovieDetailStore((store) => store.isLoading);
  const error = useMovieDetailStore((store) => store.error);
  const loadMovieDetail = useMovieDetailStore((store) => store.loadMovieDetail);
  const reset = useMovieDetailStore((store) => store.reset);

  const isFavorite = useFavoriteStore((store) =>
    store.favoriteIds.has(movieId),
  );
  const toggleFavorite = useFavoriteStore((store) => store.toggleFavorite);

  useEffect(() => {
    loadMovieDetail(movieId);
    return () => reset();
  }, [movieId, loadMovieDetail, reset]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: movie?.title ?? "" });
  }, [navigation, movie?.title]);

  if (isLoading) {
    return <LoadingView message="Loading movie detail" />;
  }

  if (error || !movie) {
    return (
      <ErrorView
        error={error ?? { kind: "not_found", message: "Movie not found" }}
        onRetry={() => loadMovieDetail(movieId)}
      />
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.backdropWrapper}>
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.backdrop, styles.backdropPlaceholder]}>
            <Ionicons
              name="film-outline"
              size={56}
              color={colors.textTertiary}
            />
          </View>
        )}
        <View style={styles.backdropGradientOverlay} />
        <View style={styles.favoriteButtonWrapper}>
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={() => toggleFavorite(movie)}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.tagline ? (
          <Text style={styles.tagline}>&quot;{movie.tagline}&quot;</Text>
        ) : null}

        <View style={styles.metaRow}>
          <RatingBadge value={formatRating(movie.vote_average)} size="large" />
          <Text style={styles.metaText}>
            {formatReleaseDate(movie.release_date)}
          </Text>
          {movie.runtime ? (
            <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
          ) : null}
        </View>

        {movie.genres.length > 0 && (
          <View style={styles.genreRow}>
            {movie.genres.map((genre) => (
              <GenreChip key={genre.id} name={genre.name} />
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>
          {movie.overview || "No overview on this movie"}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {formatRating(movie.vote_average)}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {movie.vote_count.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Votes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: spacing.xxl + 50,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  backdropWrapper: {
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: colors.surface,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backdropPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  backdropGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: colors.overlay,
  },
  favoriteButtonWrapper: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  tagline: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: "italic",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
  },
  overview: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.border,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
