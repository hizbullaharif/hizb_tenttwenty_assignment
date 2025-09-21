import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { useMovieTheme } from "../../hooks/useMovieTheme";
import { Button } from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Oops! Something went wrong",
  message,
  style,
  titleStyle,
  messageStyle,
}) => {
  const theme = useMovieTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  };

  const titleStyles: TextStyle = {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  };

  const messageStyles: TextStyle = {
    ...theme.typography.body,
    color: theme.colors.icon,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={[titleStyles, titleStyle]}>{title}</Text>
      <Text style={[messageStyles, messageStyle]}>{message}</Text>
    </View>
  );
};

// Inline error message for smaller spaces
export const InlineErrorMessage: React.FC<{
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}> = ({ message, onRetry, style }) => {
  const theme = useMovieTheme();

  const containerStyle: ViewStyle = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + "10", // 10% opacity
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.error + "30", // 30% opacity
  };

  const messageStyle: TextStyle = {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: onRetry ? theme.spacing.sm : 0,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={messageStyle}>{message}</Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} variant="ghost" size="small" />
      )}
    </View>
  );
};
