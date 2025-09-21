import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useMovieTheme } from '../hooks/useMovieTheme';
import { queryClient } from '../lib/react-query';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const theme = useMovieTheme();
  
  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    'Poppins': require('@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf'),
    'Poppins_500Medium': require('@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf'),
    'Poppins_600SemiBold': require('@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf'),
    'Poppins_700Bold': require('@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.tint,
      background: theme.colors.background,
      card: theme.colors.movieCard,
      text: theme.colors.text,
      border: theme.colors.movieCardBorder,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="movie/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'card',
            }} 
          />
          <Stack.Screen 
            name="movie/seat-selection" 
            options={{ 
              title: 'Select Seats',
              headerBackTitle: 'Back',
            }} 
          />
          <Stack.Screen 
            name="modals/video-player" 
            options={{ 
              presentation: 'fullScreenModal',
              headerShown: false,
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
