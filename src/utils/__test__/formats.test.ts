import {
  formatRating,
  formatReleaseDate,
  formatRuntime,
  getReleaseYear,
} from "../formats";

describe("formatReleaseDate", () => {
  it("formats a valid ISO date into a long human-readable date", () => {
    expect(formatReleaseDate("2010-07-16")).toBe("July 16, 2010");
  });

  it("returns a fallback message for an empty string", () => {
    expect(formatReleaseDate("")).toBe("Release date unknown");
  });

  it("returns a fallback message for an invalid date string", () => {
    expect(formatReleaseDate("not-a-date")).toBe("Release date unknown");
  });
});

describe("getReleaseYear", () => {
  it("extracts the year from an ISO date string", () => {
    expect(getReleaseYear("2010-07-16")).toBe("2010");
  });

  it("returns a dash placeholder for an empty string", () => {
    expect(getReleaseYear("")).toBe("—");
  });
});

describe("formatRating", () => {
  it("formats a vote average to one decimal place", () => {
    expect(formatRating(8.435)).toBe("8.4");
  });

  it('returns "N/A" for zero or missing ratings', () => {
    expect(formatRating(0)).toBe("N/A");
  });

  it('returns "N/A" for negative ratings (defensive)', () => {
    expect(formatRating(-1)).toBe("N/A");
  });
});

describe("formatRuntime", () => {
  it('formats minutes into "Xh Ym" when over an hour', () => {
    expect(formatRuntime(148)).toBe("2h 28m");
  });

  it('formats minutes into "Xm" when under an hour', () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("returns an empty string for null/zero runtime", () => {
    expect(formatRuntime(null)).toBe("");
    expect(formatRuntime(0)).toBe("");
  });
});
