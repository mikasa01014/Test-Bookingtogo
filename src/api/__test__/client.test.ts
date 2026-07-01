import axios from "axios";
import { getImageUrl, toAppError } from "../clients";

describe("getImageUrl", () => {
  it("builds a full TMDB image URL from a relative path", () => {
    expect(getImageUrl("/poster.jpg", "w500")).toBe(
      "https://image.tmdb.org/t/p/w500/poster.jpg",
    );
  });

  it("returns null when path is null", () => {
    expect(getImageUrl(null, "w500")).toBeNull();
  });

  it("uses the requested size bucket", () => {
    expect(getImageUrl("/backdrop.jpg", "w1280")).toBe(
      "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
    );
  });
});

describe("toAppError", () => {
  it("maps a response-less axios error (no internet) to a network error", () => {
    const error = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      response: undefined,
    });
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("network");
    expect(result.message).toMatch(/internet/i);
  });

  it("maps a 401 response to an unauthorized error", () => {
    const error = {
      isAxiosError: true,
      response: { status: 401, data: { status_message: "Invalid API key" } },
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("unauthorized");
    expect(result.message).toBe("Invalid API key");
  });

  it("maps a 404 response to a not_found error", () => {
    const error = {
      isAxiosError: true,
      response: { status: 404, data: {} },
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("not_found");
  });

  it("maps a 429 response to a server error with a rate-limit message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 429, data: {} },
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("server");
    expect(result.message).toMatch(/too many requests/i);
  });

  it("maps a 500+ response to a server error", () => {
    const error = {
      isAxiosError: true,
      response: { status: 503, data: {} },
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("server");
  });

  it("maps any other HTTP status to unknown", () => {
    const error = {
      isAxiosError: true,
      response: { status: 418, data: {} },
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toAppError(error);

    expect(result.kind).toBe("unknown");
  });

  it("maps a completely unexpected (non-axios) error to unknown", () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

    const result = toAppError(new Error("boom"));

    expect(result.kind).toBe("unknown");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
