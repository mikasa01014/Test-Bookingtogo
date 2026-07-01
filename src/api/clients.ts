import axios from "axios";
import { AppError } from "../types/movie";
import { config } from "../utils/constants/config";

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: config.TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: config.TMDB_API_KEY,
    language: "en-US",
  },
  headers: {
    Accept: "application/json",
  },
});

export function toAppError(error: unknown): AppError {
  // eslint-disable-next-line import/no-named-as-default-member
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        kind: "network",
        message:
          "No internet connection. Please check your network and try again.",
      };
    }

    const status = error.response.status;
    const tmdbMessage = (
      error.response.data as { status_message?: string } | undefined
    )?.status_message;

    if (status === 401) {
      return {
        kind: "unauthorized",
        message: tmdbMessage ?? "Invalid TMDB API key.",
      };
    }
    if (status === 404) {
      return {
        kind: "not_found",
        message: tmdbMessage ?? "The requested movie was not found.",
      };
    }
    if (status === 429) {
      return {
        kind: "server",
        message: "Too many requests. Please wait a moment and try again.",
      };
    }
    if (status >= 500) {
      return {
        kind: "server",
        message: "TMDB server error. Please try again later.",
      };
    }
    return {
      kind: "unknown",
      message: tmdbMessage ?? "Something went wrong. Please try again.",
    };
  }

  return {
    kind: "unknown",
    message: "Something went wrong. Please try again.",
  };
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "w780" | "w1280",
): string | null {
  if (!path) return null;
  return `${config.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
