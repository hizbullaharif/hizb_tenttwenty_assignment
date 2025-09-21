import { Platform } from "react-native";

export const Fonts = Platform.select({
  ios: {
    sans: "Poppins",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "Poppins",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

export const Typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    fontFamily: "Poppins_700Bold",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600" as const,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 28,
  },

  // Body text
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Poppins",
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    fontFamily: "Poppins",
    lineHeight: 20,
  },

  // Movie-specific typography
  movieTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Poppins_700Bold",
    lineHeight: 32,
  },
  movieOverview: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Poppins",
    lineHeight: 24,
  },
  movieMeta: {
    fontSize: 14,
    fontWeight: "500" as const,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
  },

  // UI elements
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Poppins_600SemiBold",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    fontFamily: "Poppins",
    lineHeight: 16,
  },
};
