import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
}: SearchBarProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={16}
        color={colors.textTertiary}
        style={{ marginRight: spacing.sm }}
      />
      <TextInput
        style={[styles.input, typography.body, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Search Movie"}
        placeholderTextColor={colors.textTertiary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search movies by title"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: "100%",
  },
});
