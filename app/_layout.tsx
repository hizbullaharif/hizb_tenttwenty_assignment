import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useMovieTheme } from '../hooks/useMovieTheme';
import { queryClient } from '../lib/react-query';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const theme = useMovieTheme();

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
