import React from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMovieTheme } from '../../hooks/useMovieTheme';
import { Text } from '../ui/Text';

interface HeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  onLeftPress,
  onRightPress,
  style,
  transparent = false,
}) => {
  const theme = useMovieTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    backgroundColor: transparent ? 'transparent' : theme.colors.background,
    paddingTop: insets.top,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44 + insets.top,
    borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.movieCardBorder,
  };

  const leftContainerStyle: ViewStyle = {
    flex: 1,
    alignItems: 'flex-start',
  };

  const centerContainerStyle: ViewStyle = {
    flex: 2,
    alignItems: 'center',
  };

  const rightContainerStyle: ViewStyle = {
    flex: 1,
    alignItems: 'flex-end',
  };

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : theme.colors.background}
        translucent={transparent}
      />
      <View style={[containerStyle, style]}>
        <View style={leftContainerStyle}>
          {leftComponent && (
            <TouchableOpacity onPress={onLeftPress} disabled={!onLeftPress}>
              {leftComponent}
            </TouchableOpacity>
          )}
        </View>

        <View style={centerContainerStyle}>
          {title && (
            <Text variant="h4" weight="semibold" numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View style={rightContainerStyle}>
          {rightComponent && (
            <TouchableOpacity onPress={onRightPress} disabled={!onRightPress}>
              {rightComponent}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};