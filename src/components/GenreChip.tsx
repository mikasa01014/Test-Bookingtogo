import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface GenreChipProps {
  name: string;
}

export function GenreChip({ name }: GenreChipProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[typography.caption, { color: colors.text }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
  },
});
