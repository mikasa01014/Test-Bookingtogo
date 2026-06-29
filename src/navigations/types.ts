export type RootStackParamList = {
  Home: undefined;
  MovieDetail: {
    movieId: number;
  };
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
