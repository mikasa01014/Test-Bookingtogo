import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}
export function EmptyState({
  icon = "film-outline",
  title,
  message,
}: EmptyStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xxl,
          gap: spacing.sm,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={44}
        color={colors.textTertiary}
        style={{ marginBottom: spacing.sm }}
      />
      <Text
        style={[typography.h3, { color: colors.text, textAlign: "center" }]}
      >
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, textAlign: "center" },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
