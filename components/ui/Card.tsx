import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle
} from 'react-native';
import { useMovieTheme } from '../../hooks/useMovieTheme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof import('../../styles/spacing').Spacing;
  style?: ViewStyle;
  touchable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  touchable = false,
  ...touchableProps
}) => {
  const theme = useMovieTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.movieCard,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[padding],
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {},
      elevated: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.movieCardBorder,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  if (touchable) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        activeOpacity={0.7}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};