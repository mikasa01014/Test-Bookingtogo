import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../themes/ThemeProvider";
import { ThemePreference, useThemeStore } from "../themes/themeStore";

const OPTIONS: {
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { value: "system", icon: "phone-portrait-outline", label: "System" },
  { value: "light", icon: "sunny-outline", label: "Light" },
  { value: "dark", icon: "moon-outline", label: "Dark" },
];

export function ThemeToggle() {
  const { colors, radius, spacing, typography } = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const [trackWidth, setTrackWidth] = React.useState(0);
  const indicatorX = useSharedValue(0);

  const activeIndex = OPTIONS.findIndex((o) => o.value === preference);
  const optionWidth = trackWidth / OPTIONS.length;

  useEffect(() => {
    if (trackWidth === 0) return;
    indicatorX.value = withTiming(activeIndex * optionWidth, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, optionWidth, trackWidth, indicatorX]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: optionWidth,
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.track,
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.full,
          borderColor: colors.border,
        },
      ]}
    >
      {trackWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: colors.primary, borderRadius: radius.full },
          ]}
        />
      )}
      {OPTIONS.map((option) => {
        const isActive = option.value === preference;
        return (
          <Pressable
            key={option.value}
            style={[styles.option, { paddingVertical: spacing.sm }]}
            onPress={() => setPreference(option.value)}
            accessibilityRole="button"
            accessibilityLabel={`${option.label} theme`}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={option.icon}
              size={15}
              color={isActive ? colors.background : colors.textSecondary}
              style={{ marginRight: spacing.xs }}
            />
            <Animated.Text
              style={[
                typography.small,
                { color: isActive ? colors.background : colors.textSecondary },
              ]}
            >
              {option.label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    position: "relative",
    borderWidth: 1,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
