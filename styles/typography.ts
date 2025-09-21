import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: Fonts.sans,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    fontFamily: Fonts.sans,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: Fonts.sans,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: Fonts.sans,
    lineHeight: 28,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 20,
  },
  
  // Movie-specific typography
  movieTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: Fonts.sans,
    lineHeight: 32,
  },
  movieOverview: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 24,
  },
  movieMeta: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: Fonts.sans,
    lineHeight: 20,
  },
  
  // UI elements
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: Fonts.sans,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 16,
  },
};