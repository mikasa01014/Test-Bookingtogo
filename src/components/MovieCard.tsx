import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { getImageUrl } from "../api/clients";
import { useTheme } from "../themes/ThemeProvider";
import { Movie } from "../types/movie";
import { formatRating, getReleaseYear } from "../utils/formats";
import { RatingBadge } from "./RatingBadge";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie, cardRef: React.RefObject<View | null>) => void;
  isFavorite?: boolean;
  index: number;
}

const STAGGER_STEP_MS = 45;
const MAX_STAGGER_MS = 360;
const ENTRANCE_DURATION_MS = 420;

function MovieCardBase({ movie, onPress, isFavorite, index }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const { colors, radius, spacing, typography } = useTheme();
  const cardRef = React.useRef<View>(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    const delay = Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS);

    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: ENTRANCE_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 24 },
      { scale: 0.92 + progress.value * 0.08 },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        ref={cardRef}
        style={({ pressed }) => [pressed && styles.pressed]}
        onPress={() => onPress(movie, cardRef)}
        accessibilityRole="button"
        accessibilityLabel={`Open details for ${movie.title}`}
      >
        <View
          style={[
            styles.posterWrapper,
            {
              borderRadius: radius.md,
              backgroundColor: colors.surface,
              shadowColor: colors.shadow,
            },
          ]}
        >
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
          <View
            style={[
              styles.ratingOverlay,
              { top: spacing.xs, right: spacing.xs },
            ]}
          >
            <RatingBadge
              value={formatRating(movie.vote_average)}
              size="small"
            />
          </View>
          {isFavorite && (
            <View
              style={[
                styles.favoriteBadge,
                {
                  top: spacing.xs,
                  left: spacing.xs,
                  backgroundColor: colors.overlay,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Ionicons name="heart" size={13} color={colors.favorite} />
            </View>
          )}
        </View>

        <Text
          style={[
            typography.bodyBold,
            { color: colors.text, marginTop: spacing.sm },
          ]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: 2 },
          ]}
        >
          {getReleaseYear(movie.release_date)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export const MovieCard = memo(MovieCardBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    maxWidth: "47%",
  },
  pressed: {
    opacity: 0.7,
  },
  posterWrapper: {
    position: "relative",
    aspectRatio: 2 / 3,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
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
  },
  favoriteBadge: {
    position: "absolute",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
