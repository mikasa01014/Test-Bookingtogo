import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface RatingBadgeProps {
  value: string;
  size?: "small" | "large";
}

export function RatingBadge({ value, size = "small" }: RatingBadgeProps) {
  const isSmall = size === "small";
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.overlay, borderRadius: radius.full },
        isSmall
          ? { paddingHorizontal: spacing.sm, paddingVertical: 3, gap: 3 }
          : {
              paddingHorizontal: spacing.md - 8,
              paddingVertical: spacing.xs,
              gap: spacing.xs,
            },
      ]}
    >
      <Ionicons name="star" size={isSmall ? 11 : 16} color={colors.star} />
      <Text
        style={[
          isSmall ? typography.small : typography.bodyBold,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
