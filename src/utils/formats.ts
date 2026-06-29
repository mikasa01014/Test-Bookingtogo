export function formatReleaseDate(isoDate: string): string {
  if (!isoDate) return "Release date unknown";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Release date unknown";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getReleaseYear(isoDate: string): string {
  if (!isoDate) return "—";
  const year = isoDate.split("-")[0];
  return year || "—";
}

export function formatRating(voteAverage: number): string {
  if (!voteAverage || voteAverage <= 0) return "N/A";
  return voteAverage.toFixed(1);
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
