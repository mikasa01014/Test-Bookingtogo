import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";
import { AppError } from "../types/movie";

interface ErrorViewProps {
  error: AppError;
  onRetry: () => void;
  fullScreen?: boolean;
}

type IoniconName =
  | "cloud-offline-outline"
  | "search-outline"
  | "key-outline"
  | "build-outline"
  | "warning-outline";

export function ErrorView({
  error,
  onRetry,
  fullScreen = true,
}: ErrorViewProps) {
  const { icon, title } = getErrorPresentation(error);
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xl,
          gap: spacing.sm,
        },
        fullScreen && { flex: 1, backgroundColor: colors.background },
      ]}
    >
      <Ionicons
        name={icon}
        size={48}
        color={colors.textSecondary}
        style={{ marginBottom: spacing.sm }}
      />
      <Text
        style={[typography.h3, { color: colors.text, textAlign: "center" }]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          {
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: spacing.md,
          },
        ]}
      >
        {error.message}
      </Text>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
          },
          pressed && styles.retryButtonPressed,
        ]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <Text style={[typography.bodyBold, { color: colors.background }]}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}

function getErrorPresentation(error: AppError): {
  icon: IoniconName;
  title: string;
} {
  switch (error.kind) {
    case "network":
      return { icon: "cloud-offline-outline", title: "No Internet Connection" };
    case "not_found":
      return { icon: "search-outline", title: "Not Found" };
    case "unauthorized":
      return { icon: "key-outline", title: "Configuration Error" };
    case "server":
      return { icon: "build-outline", title: "Server Error" };
    default:
      return { icon: "warning-outline", title: "Something Went Wrong" };
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
});
