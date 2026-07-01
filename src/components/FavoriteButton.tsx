import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../themes/ThemeProvider";

interface favoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: "small" | "large";
}

const PARTICLE_ANGLES = [-100, -55, -20, 20, 55, 100];

export function FavoriteButton({
  isFavorite,
  onPress,
  size = "large",
}: favoriteButtonProps) {
  const isLarge = size === "large";
  const { colors } = useTheme();
  const iconSize = isLarge ? 24 : 18;
  const buttonSize = isLarge ? 48 : 36;

  const heartScale = useSharedValue(1);
  const burst = useSharedValue(0);

  const prevFavoriteRef = useRef(isFavorite);

  useEffect(() => {
    const justFavorite = isFavorite && !prevFavoriteRef.current;
    prevFavoriteRef.current = isFavorite;

    if (justFavorite) {
      heartScale.value = withSequence(
        withTiming(1.35, {
          duration: 140,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0.92, {
          duration: 110,
          easing: Easing.inOut(Easing.cubic),
        }),
        withTiming(1, {
          duration: 120,
          easing: Easing.out(Easing.back(1.6)),
        }),
      );
      burst.value = 0;
      burst.value = withTiming(1, {
        duration: 520,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isFavorite, heartScale, burst]);

  const handleOnPress = useCallback(() => {
    onPress();
  }, [onPress]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <Pressable
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: colors.overlay,
        },
      ]}
      onPress={handleOnPress}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      hitSlop={8}
    >
      {PARTICLE_ANGLES.map((angle, i) => (
        <Particle
          key={i}
          angle={angle}
          burst={burst}
          color={colors.favorite}
          isLarge={isLarge}
        />
      ))}
      <Animated.View style={heartStyle}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={iconSize}
          color={colors.favorite}
        />
      </Animated.View>
    </Pressable>
  );
}

function Particle({
  angle,
  burst,
  color,
  isLarge,
}: {
  angle: number;
  burst: SharedValue<number>;
  color: string;
  isLarge: boolean;
}) {
  const distance = isLarge ? 26 : 20;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) * distance;
  const dy = -Math.cos(rad) * distance;

  const style = useAnimatedStyle(() => {
    // Particles shoot out over the first ~60% of the burst, then fade
    // out over the remainder — gives a "pop and dissolve" feel rather
    // than a linear fade the whole time.
    const travel = interpolate(burst.value, [0, 0.6, 1], [0, 1, 1], "clamp");
    const opacity = interpolate(
      burst.value,
      [0, 0.15, 0.6, 1],
      [0, 1, 1, 0],
      "clamp",
    );
    const scale = interpolate(burst.value, [0, 0.2, 1], [0.3, 1, 0.6], "clamp");

    return {
      opacity,
      transform: [
        { translateX: dx * travel },
        { translateY: dy * travel },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.particle, { backgroundColor: color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
