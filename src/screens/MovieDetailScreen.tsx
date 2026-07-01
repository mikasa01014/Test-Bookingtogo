import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DetailBackdropHeader } from "../components/DetailBackdropHeader";
import { ErrorView } from "../components/ErrorView";
import { LoadingView } from "../components/LoadingView";
import { MovieDetailContent } from "../components/MovieDetailContent";
import { useSharedPoster } from "../navigations/SharedPosterContext";
import { RootStackParamList } from "../navigations/types";
import { useMovieDetailScreenData } from "../navigations/useMovieDetailScreenData";
import { useTheme } from "../themes/ThemeProvider";

type DetailRouteProp = RouteProp<RootStackParamList, "MovieDetail">;
type DetailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "MovieDetail"
>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BACKDROP_HEIGHT = SCREEN_WIDTH * 0.62;
const BACKDROP_ANIM_MS = 360;
const SHEET_ANIM_MS = 420;

export function MovieDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const insets = useSafeAreaInsets();
  const { colors, radius } = useTheme();
  const { movieId, posterUrl: routePosterUrl } = route.params;
  const { consumeMeasurement } = useSharedPoster();

  const {
    movie,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    backdropUrl,
    retry,
  } = useMovieDetailScreenData(movieId);

  const initialMeasurement = React.useRef(consumeMeasurement(movieId)).current;
  const startFrame = initialMeasurement ?? {
    x: 0,
    y: insets.top,
    width: SCREEN_WIDTH,
    height: BACKDROP_HEIGHT,
    posterUrl: routePosterUrl ?? null,
  };

  const backdropProgress = useSharedValue(0);
  const sheetProgress = useSharedValue(0);

  useEffect(() => {
    backdropProgress.value = withTiming(1, {
      duration: BACKDROP_ANIM_MS,
      easing: Easing.out(Easing.cubic),
    });
    sheetProgress.value = withTiming(1, {
      duration: SHEET_ANIM_MS,
      easing: Easing.out(Easing.back(0.9)),
    });
  }, [backdropProgress, sheetProgress]);

  const backdropStyle = useAnimatedStyle(() => {
    const x = startFrame.x + (0 - startFrame.x) * backdropProgress.value;
    const y = startFrame.y + (0 - startFrame.y) * backdropProgress.value;
    const width =
      startFrame.width +
      (SCREEN_WIDTH - startFrame.width) * backdropProgress.value;
    const height =
      startFrame.height +
      (BACKDROP_HEIGHT - startFrame.height) * backdropProgress.value;
    const borderRadius = 10 * (1 - backdropProgress.value);

    return {
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      borderRadius,
      overflow: "hidden",
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    const translateY = interpolate(sheetProgress.value, [0, 1], [60, 0]);
    const cornerRadius = interpolate(
      sheetProgress.value,
      [0, 1],
      [radius.xl, 0],
      "clamp",
    );
    return {
      opacity: interpolate(
        sheetProgress.value,
        [0, 0.4, 1],
        [0, 1, 1],
        "clamp",
      ),
      transform: [{ translateY }],
      borderTopLeftRadius: cornerRadius,
      borderTopRightRadius: cornerRadius,
      backgroundColor: colors.background,
    };
  });

  if (isLoading && !movie) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <Animated.View style={backdropStyle}>
          <DetailBackdropHeader
            movie={null}
            backdropUrl={startFrame.posterUrl}
            isFavorite={false}
            onToggleFavorite={() => {}}
            onBack={() => navigation.goBack()}
            topSafeInset={insets.top}
          />
        </Animated.View>
        <View style={{ marginTop: BACKDROP_HEIGHT }}>
          <LoadingView message="Loading movie details..." fullScreen={false} />
        </View>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <ErrorView
          error={error ?? { kind: "not_found", message: "Movie not found." }}
          onRetry={retry}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.fill,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Animated.View style={backdropStyle}>
        <DetailBackdropHeader
          movie={movie}
          backdropUrl={backdropUrl ?? startFrame.posterUrl}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(movie)}
          onBack={() => navigation.goBack()}
          topSafeInset={insets.top}
        />
      </Animated.View>

      <Animated.View
        style={[styles.fill, sheetStyle, { marginTop: BACKDROP_HEIGHT - 18 }]}
      >
        <MovieDetailContent movie={movie} topInset={18} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
