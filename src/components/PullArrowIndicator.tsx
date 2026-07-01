import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import ReanimatedAnimated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "../themes/ThemeProvider";

const PULL_THRESHOLD = 80;

interface PullArrowIndicatorProps {
  /** Raw pull distance in px (0 = not pulled, positive = pulled down). */
  pullDistance: SharedValue<number>;
  isRefreshing: boolean;
}

export function PullArrowIndicator({
  pullDistance,
  isRefreshing,
}: PullArrowIndicatorProps) {
  const { colors } = useTheme();

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pullDistance.value,
      [0, 30, PULL_THRESHOLD],
      [0, 0.6, 1],
      "clamp",
    );
    const scale = interpolate(
      pullDistance.value,
      [0, PULL_THRESHOLD],
      [0.6, 1],
      "clamp",
    );
    return {
      opacity: isRefreshing ? 1 : opacity,
      transform: [{ scale: isRefreshing ? 1 : scale }],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    // 0deg (pointing down) below threshold, 180deg (pointing up) past it.
    const rotate = interpolate(
      pullDistance.value,
      [0, PULL_THRESHOLD],
      [0, 180],
      "clamp",
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <ReanimatedAnimated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
          containerStyle,
        ]}
      >
        {isRefreshing ? (
          <SpinningRing color={colors.primary} />
        ) : (
          <ReanimatedAnimated.View style={arrowStyle}>
            <Ionicons name="arrow-down" size={20} color={colors.primary} />
          </ReanimatedAnimated.View>
        )}
      </ReanimatedAnimated.View>
    </View>
  );
}

function SpinningRing({ color }: { color: string }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Ionicons name="refresh" size={18} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});

export { PULL_THRESHOLD };

