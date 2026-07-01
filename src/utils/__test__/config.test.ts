/* eslint-disable @typescript-eslint/no-require-imports */
describe("config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it("should use the API key from environment", () => {
    process.env.EXPO_PUBLIC_TMDB_API_KEY = "my-api-key";

    jest.resetModules();

    const { config } = require("../constants/config");

    expect(config.TMDB_API_KEY).toBe("my-api-key");
    expect(config.TMDB_BASE_URL).toBe("https://api.themoviedb.org/3");
    expect(config.TMDB_IMAGE_BASE_URL).toBe("https://image.tmdb.org/t/p");
  });

  it("should fallback to empty string when API key is missing", () => {
    delete process.env.EXPO_PUBLIC_TMDB_API_KEY;

    jest.resetModules();

    const { config } = require("../constants/config");

    expect(config.TMDB_API_KEY).toBe("");
  });

  it("should warn when API key is missing", () => {
    delete process.env.EXPO_PUBLIC_TMDB_API_KEY;

    jest.resetModules();

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { apiKeyConfig } = require("../constants/config");

    apiKeyConfig();

    expect(warnSpy).toHaveBeenCalledWith(
      "[ENV] EXPO_PUBLIC_TMDB_API_KEY is not set. " +
        "Please, create a .env file based on .env.example thank you :)",
    );
  });

  it("should log when API key exists", () => {
    process.env.EXPO_PUBLIC_TMDB_API_KEY = "abc123";

    jest.resetModules();

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const { apiKeyConfig } = require("../constants/config");

    apiKeyConfig();

    expect(logSpy).toHaveBeenCalledWith("run");
  });
});
