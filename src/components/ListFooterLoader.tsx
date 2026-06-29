import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors, spacing } from "../themes/theme";

interface ListFooterLoaderProps {
  visible: boolean;
}

export function ListFooterLoader({ visible }: ListFooterLoaderProps) {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
});
