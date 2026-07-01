import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface LoadingViewProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingView({
  message = "Loading",
  fullScreen = true,
}: LoadingViewProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { gap: spacing.md },
        fullScreen && { flex: 1, backgroundColor: colors.background },
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
});
