import React from 'react';
import {
    Text as RNText,
    TextProps as RNTextProps,
    TextStyle,
} from 'react-native';
import { useMovieTheme } from '../../hooks/useMovieTheme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'movieTitle' | 'movieMeta';
  color?: 'text' | 'icon' | 'tint' | 'error' | 'success' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const theme = useMovieTheme();

  const getTextStyle = (): TextStyle => {
    const baseStyle = theme.typography[variant] || theme.typography.body;
    
    const colorStyle: TextStyle = {
      color: theme.colors[color] || theme.colors.text,
    };

    const alignStyle: TextStyle = {
      textAlign: align,
    };

    const weightStyle: TextStyle = weight ? {
      fontWeight: weight === 'normal' ? '400' :
                  weight === 'medium' ? '500' :
                  weight === 'semibold' ? '600' : '700',
    } : {};

    return {
      ...baseStyle,
      ...colorStyle,
      ...alignStyle,
      ...weightStyle,
    };
  };

  return (
    <RNText style={[getTextStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};