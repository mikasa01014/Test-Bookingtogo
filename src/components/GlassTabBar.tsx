import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../themes/ThemeProvider";

type GlassViewType = React.ComponentType<{
  style: object;
  children?: React.ReactNode;
}>;
let GlassView: GlassViewType | null = null;
let isLiquidGlassAvailable: (() => boolean) | null = null;

if (Platform.OS === "ios") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const glassEffect = require("expo-glass-effect");
    GlassView = glassEffect.GlassView ?? null;
    isLiquidGlassAvailable = glassEffect.isLiquidGlassAvailable ?? null;
  } catch {
    GlassView = null;
    isLiquidGlassAvailable = null;
  }
}

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
const TAB_ICONS: Record<
  string,
  { active: IoniconName; inactive: IoniconName }
> = {
  HomeTab: { active: "home", inactive: "home-outline" },
  FavoritesTab: { active: "heart", inactive: "heart-outline" },
};

const PILL_HEIGHT = 64;
const PILL_HORIZONTAL_MARGIN = 24;
const BUBBLE_INSET = 5;
const ANIM_DURATION = 300;

export function GlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors, radius, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [pillWidth, setPillWidth] = React.useState(0);
  const tabCount = state.routes.length;
  const tabWidth = pillWidth > 0 ? pillWidth / tabCount : 0;

  const bubbleX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth === 0) return;
    bubbleX.value = withTiming(state.index * tabWidth, {
      duration: ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [state.index, tabWidth, bubbleX]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
    width: tabWidth,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    setPillWidth(e.nativeEvent.layout.width);
  };

  const canUseGlass =
    Platform.OS === "ios" &&
    GlassView !== null &&
    isLiquidGlassAvailable !== null &&
    isLiquidGlassAvailable();

  const pillContent = (
    <View
      style={{
        paddingHorizontal: 10,
        flex: 1,
      }}
    >
      <View style={styles.pillInner} onLayout={handleLayout}>
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.activeBubble,
              bubbleStyle,
              {
                height: PILL_HEIGHT - BUBBLE_INSET * 2,
                borderRadius: radius.xl,
                backgroundColor: canUseGlass
                  ? "rgba(255,255,255,0.22)"
                  : scheme === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.08)",
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? {
            active: "ellipse",
            inactive: "ellipse-outline",
          };

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const iconColor = isFocused ? colors.primary : colors.textSecondary;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            >
              <Ionicons
                name={isFocused ? icons.active : icons.inactive}
                size={22}
                color={iconColor}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: iconColor,
                    fontWeight: isFocused ? "700" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const solidPillStyle = {
    borderRadius: PILL_HEIGHT / 2,
    backgroundColor:
      scheme === "dark" ? "rgba(26,29,41,0.92)" : "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, 16) + 4,
          left: PILL_HORIZONTAL_MARGIN,
          right: PILL_HORIZONTAL_MARGIN,
        },
      ]}
      pointerEvents="box-none"
    >
      {canUseGlass && GlassView ? (
        <GlassView
          style={[
            styles.pill,
            { borderRadius: PILL_HEIGHT / 2, overflow: "hidden" },
          ]}
        >
          {pillContent}
        </GlassView>
      ) : (
        <View style={[styles.pill, solidPillStyle]}>{pillContent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  pill: {
    height: PILL_HEIGHT,
    overflow: "hidden",
  },
  pillInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
  activeBubble: {
    position: "absolute",
    top: BUBBLE_INSET,
    left: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: "100%",
  },
  label: {
    fontSize: 11,
  },
});
