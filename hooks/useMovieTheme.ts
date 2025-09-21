import { useColorScheme } from "react-native";
import { useAppStore } from "../store/appStore";
import { createTheme } from "../styles/theme";

export const useMovieTheme = () => {
  const systemColorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.theme);

  // Determine the actual theme to use
  const effectiveColorScheme =
    themePreference === "system"
      ? systemColorScheme ?? "light"
      : themePreference;

  const theme = createTheme(effectiveColorScheme);

  return theme;
};
