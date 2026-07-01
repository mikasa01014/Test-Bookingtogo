import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface ListFooterLoaderProps {
  visible: boolean;
}

export function ListFooterLoader({ visible }: ListFooterLoaderProps) {
  const { colors, spacing } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.container, { paddingVertical: spacing.lg }]}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
