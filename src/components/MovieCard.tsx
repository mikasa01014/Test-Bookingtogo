import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getImageUrl } from "../api/clients";
import { colors, radius, spacing, typography } from "../themes/theme";
import { Movie } from "../types/movie";
import { formatRating, getReleaseYear } from "../utils/formats";
import { RatingBadge } from "./RatingBadge";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  isFavorite?: boolean;
}

function MovieCardBase({ movie, onPress, isFavorite }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(movie)}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${movie.title}`}
    >
      <View style={styles.posterWrapper}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons
              name="film-outline"
              size={32}
              color={colors.textTertiary}
            />
          </View>
        )}
        <View style={styles.ratingOverlay}>
          <RatingBadge value={formatRating(movie.vote_average)} size="small" />
        </View>
        {isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={13} color={colors.favorite} />
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{getReleaseYear(movie.release_date)}</Text>
    </Pressable>
  );
}

export const MovieCard = memo(MovieCardBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.sm,
    maxWidth: "47%",
  },
  pressed: {
    opacity: 0.7,
  },
  posterWrapper: {
    position: "relative",
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  ratingOverlay: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
  },
  favoriteBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.overlay,
    borderRadius: radius.full,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  year: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
