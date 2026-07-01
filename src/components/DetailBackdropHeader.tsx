import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";
import { MovieDetail } from "../types/movie";
import { FavoriteButton } from "./FavoriteButton";

interface DetailBackdropHeaderProps {
  movie: MovieDetail | null;
  backdropUrl: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  topSafeInset: number;
}

export function DetailBackdropHeader({
  movie,
  backdropUrl,
  isFavorite,
  onToggleFavorite,
  onBack,
  topSafeInset,
}: DetailBackdropHeaderProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill}>
      {backdropUrl ? (
        <Image
          source={{ uri: backdropUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons name="film-outline" size={56} color={colors.textTertiary} />
        </View>
      )}

      <LinearGradient
        colors={["transparent", colors.background]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[colors.overlay, "transparent"]}
        style={styles.topFade}
        pointerEvents="none"
      />

      <Pressable
        onPress={onBack}
        style={[
          styles.backButton,
          { top: topSafeInset + spacing.sm, backgroundColor: colors.overlay },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      {movie && (
        <View
          style={[
            styles.favoriteWrapper,
            { top: topSafeInset + spacing.sm, right: spacing.lg },
          ]}
        >
          <FavoriteButton isFavorite={isFavorite} onPress={onToggleFavorite} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  topFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 90,
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteWrapper: {
    position: "absolute",
  },
});
