import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { colors, radius } from "../themes/theme";

interface favoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: "small" | "large";
}

export function FavoriteButton({
  isFavorite,
  onPress,
  size = "large",
}: favoriteButtonProps) {
  const isLarge = size === "large";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isLarge ? styles.buttonLarge : styles.buttonSmall,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      hitSlop={8}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={isLarge ? 24 : 18}
        color={colors.favorite}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.overlay,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLarge: {
    width: 48,
    height: 48,
  },
  buttonSmall: {
    width: 36,
    height: 36,
  },
  pressed: {
    opacity: 0.7,
  },
});
