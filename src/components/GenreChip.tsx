import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../themes/theme";

interface GenreChipProps {
  name: string;
}

export function GenreChip({ name }: GenreChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.caption,
    color: colors.text,
  },
});
