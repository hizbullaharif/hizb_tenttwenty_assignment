import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useMovieTheme } from "@/hooks/useMovieTheme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color,
  message,
  style,
  textStyle,
}) => {
  const theme = useMovieTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  };

  const messageStyle: TextStyle = {
    ...theme.typography.body,
    color: theme.colors.darkPurple,
    marginTop: theme.spacing.md,
    textAlign: "center",
  };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.tint} />
      {message && <Text style={[messageStyle, textStyle]}>{message}</Text>}
    </View>
  );
};

export const InlineLoadingSpinner: React.FC<{
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}> = ({ size = "small", color, style }) => {
  const theme = useMovieTheme();

  return (
    <View style={[{ padding: theme.spacing.sm }, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.tint} />
    </View>
  );
};
