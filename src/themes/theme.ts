export interface ColorPalette {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryMuted: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  error: string;
  errorBackground: string;
  success: string;
  overlay: string;
  overlayLight: string;
  star: string;
  favorite: string;
  shadow: string;
  gradientStart: string;
  gradientEnd: string;
  skeleton: string;
  skeletonHighlight: string;
}

export const darkPalette: ColorPalette = {
  background: "#0B0D13",
  backgroundElevated: "#11141C",
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
  overlay: "rgba(11,13,19,0.82)",
  overlayLight: "rgba(11,13,19,0.45)",
  star: "#F5C518",
  favorite: "#FF4D67",
  shadow: "#000000",
  gradientStart: "rgba(11,13,19,0)",
  gradientEnd: "rgba(11,13,19,1)",
  skeleton: "#1F222F",
  skeletonHighlight: "#2A2E3F",
};

export const lightPalette: ColorPalette = {
  background: "#F7F7FA",
  backgroundElevated: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceElevated: "#F0F1F5",
  primary: "#D6A608",
  primaryMuted: "#EDD68A",
  text: "#14151A",
  textSecondary: "#5B5D6B",
  textTertiary: "#8C8E9C",
  border: "#E3E4EA",
  error: "#D9342B",
  errorBackground: "#FBEAEA",
  success: "#1C9A65",
  overlay: "rgba(247,247,250,0.85)",
  overlayLight: "rgba(255,255,255,0.55)",
  star: "#D6A608",
  favorite: "#E3304B",
  shadow: "#2B2D38",
  gradientStart: "rgba(247,247,250,0)",
  gradientEnd: "rgba(247,247,250,1)",
  skeleton: "#E9EAEF",
  skeletonHighlight: "#F4F4F8",
};

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
  xl: 24,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyBold: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  small: { fontSize: 11, fontWeight: "600" as const },
} as const;
