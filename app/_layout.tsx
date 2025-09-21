import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { queryClient } from "@/lib/react-query";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

const FONTS_CONFIG = {
  Poppins: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
  Poppins_500Medium: require("@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf"),
  Poppins_600SemiBold: require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
  Poppins_700Bold: require("@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf"),
} as const;

// Screen configuration
const SCREEN_OPTIONS = {
  tabs: { headerShown: false },
  movieDetails: {
    headerShown: false,
    presentation: "card" as const,
  },
  seatSelection: {
    title: "Select Seats",
    headerBackTitle: "Back",
  },
  videoPlayer: {
    presentation: "fullScreenModal" as const,
    headerShown: false,
  },
} as const;

const useAppInitialization = () => {
  const [fontsLoaded] = useFonts(FONTS_CONFIG);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded };
};

const AppStack = () => (
  <Stack>
    <Stack.Screen name="(tabs)" options={SCREEN_OPTIONS.tabs} />
    <Stack.Screen name="movie/[id]" options={SCREEN_OPTIONS.movieDetails} />
    <Stack.Screen
      name="movie/seat-selection"
      options={SCREEN_OPTIONS.seatSelection}
    />
    <Stack.Screen
      name="modals/video-player"
      options={SCREEN_OPTIONS.videoPlayer}
    />
    <Stack.Screen name="+not-found" />
  </Stack>
);

export default function RootLayout() {
  const { fontsLoaded } = useAppInitialization();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AppStack />
    </QueryClientProvider>
  );
}
