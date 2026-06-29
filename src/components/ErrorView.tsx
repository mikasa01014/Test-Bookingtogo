import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../themes/theme";
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

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Ionicons
        name={icon}
        size={48}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{error.message}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <Text style={styles.retryText}>Try Again</Text>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});
