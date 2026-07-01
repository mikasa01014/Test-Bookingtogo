import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { View } from "react-native";
import { getImageUrl } from "../api/clients";
import { Movie } from "../types/movie";
import { useSharedPoster } from "./SharedPosterContext";
import { RootStackParamList } from "./types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useMovieNavigation() {
  const navigation = useNavigation<NavigationProp>();
  const { setMeasurement } = useSharedPoster();

  const navigateToDetail = useCallback(
    (movie: Movie, cardRef: React.RefObject<View | null>) => {
      const posterUrl = getImageUrl(movie.poster_path, "w500");

      const node = cardRef.current;
      if (node) {
        node.measureInWindow((x, y, width, height) => {
          setMeasurement(movie.id, { x, y, width, height, posterUrl });
          navigation.navigate("MovieDetail", { movieId: movie.id, posterUrl });
        });
      } else {
        navigation.navigate("MovieDetail", { movieId: movie.id, posterUrl });
      }
    },
    [navigation, setMeasurement],
  );

  return { navigateToDetail };
}
