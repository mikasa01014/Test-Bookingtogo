export const config = {
  TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "",
  TMDB_BASE_URL: "https://api.themoviedb.org/3",
  TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};

export function apiKeyConfig(): void {
  if (!config.TMDB_API_KEY) {
    console.warn(
      "[ENV] EXPO_PUBLIC_TMDB_API_KEY is not set. " +
        "Please, create a .env file based on .env.example thank you :)",
    );
  } else {
    console.log("run");
  }
}
