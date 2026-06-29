export const colors = {
  background: "#0F1117",
  surface: "#1A1D29",
  surfaceElevated: "#232636",
  primary: "#F5C518",
  primaryMuted: "#7A6418",
  text: "#FFFFFF",
  textSecondary: "#A4A6B3",
  textTertiary: "#6E7080",
  border: "#2C2F3E",
  error: "#FF5C5C",
  errorBackground: "#3A1F22",
  success: "#3DDC97",
  overlay: "rgba(15,17,23,0.75)",
  star: "#F5C518",
  favorite: "#FF4D67",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 22, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyBold: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  small: { fontSize: 11, fontWeight: "500" as const },
} as const;
