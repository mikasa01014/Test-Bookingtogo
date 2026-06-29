import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../themes/theme";

interface RatingBadgeProps {
  value: string;
  size?: "small" | "large";
}

export function RatingBadge({ value, size = "small" }: RatingBadgeProps) {
  const isSmall = size === "small";
  return (
    <View
      style={[
        styles.container,
        isSmall ? styles.containerSmall : styles.containerLarge,
      ]}
    >
      <Ionicons name="star" size={isSmall ? 11 : 16} color={colors.star} />
      <Text style={isSmall ? styles.textSmall : styles.textLarge}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.overlay,
    borderRadius: radius.full,
  },
  containerSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  containerLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  textSmall: {
    ...typography.small,
    color: colors.text,
  },
  textLarge: {
    ...typography.bodyBold,
    color: colors.text,
  },
});
