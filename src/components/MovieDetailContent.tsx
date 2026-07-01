import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";
import { MovieDetail } from "../types/movie";
import {
  formatRating,
  formatReleaseDate,
  formatRuntime,
} from "../utils/formats";
import { GenreChip } from "./GenreChip";
import { RatingBadge } from "./RatingBadge";

interface MovieDetailContentProps {
  movie: MovieDetail;
  topInset: number;
}

export function MovieDetailContent({
  movie,
  topInset,
}: MovieDetailContentProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ height: topInset }} />

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          gap: spacing.md,
        }}
      >
        <Text style={[typography.h1, { color: colors.text }]}>
          {movie.title}
        </Text>
        {movie.tagline ? (
          <Text
            style={[
              typography.body,
              { color: colors.textTertiary, fontStyle: "italic" },
            ]}
          >
            &quot;{movie.tagline}&quot;
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <RatingBadge value={formatRating(movie.vote_average)} size="large" />
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {formatReleaseDate(movie.release_date)}
          </Text>
          {movie.runtime ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {formatRuntime(movie.runtime)}
            </Text>
          ) : null}
        </View>

        {movie.genres.length > 0 && (
          <View style={[styles.genreRow, { gap: spacing.sm }]}>
            {movie.genres.map((genre) => (
              <GenreChip key={genre.id} name={genre.name} />
            ))}
          </View>
        )}

        <Text
          style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]}
        >
          Overview
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, lineHeight: 22 },
          ]}
        >
          {movie.overview || "No overview available for this movie."}
        </Text>

        <View
          style={[
            styles.statsRow,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.lg,
              marginTop: spacing.sm,
            },
          ]}
        >
          <View style={styles.statBox}>
            <Text style={[typography.h2, { color: colors.primary }]}>
              {formatRating(movie.vote_average)}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Rating
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statBox}>
            <Text style={[typography.h2, { color: colors.primary }]}>
              {movie.vote_count.toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Votes
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
});
