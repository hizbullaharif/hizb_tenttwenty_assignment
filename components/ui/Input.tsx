import React from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { useMovieTheme } from '../../hooks/useMovieTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...textInputProps
}) => {
  const theme = useMovieTheme();

  const containerStyles: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const labelStyles: TextStyle = {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  };

  const inputStyles: TextStyle = {
    ...theme.typography.body,
    backgroundColor: theme.colors.movieCard,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.movieCardBorder,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    minHeight: 44,
  };

  const errorStyles: TextStyle = {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && (
        <Text style={[labelStyles, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[inputStyles, inputStyle]}
        placeholderTextColor={theme.colors.icon}
        {...textInputProps}
      />
      {error && (
        <Text style={[errorStyles, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};