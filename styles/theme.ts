import { Colors } from './colors';
import { BorderRadius, Spacing } from './spacing';
import { Typography } from './typography';

export const createTheme = (colorScheme: 'light' | 'dark') => ({
  colors: Colors[colorScheme],
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  isDark: colorScheme === 'dark',
});

export type Theme = ReturnType<typeof createTheme>;