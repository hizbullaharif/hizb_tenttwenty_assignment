import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMovieTheme } from '../../hooks/useMovieTheme';
import { Text } from '../ui/Text';

interface TabItem {
  key: string;
  title: string;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: ViewStyle;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
}) => {
  const theme = useMovieTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.movieCardBorder,
    paddingBottom: insets.bottom,
    paddingTop: theme.spacing.sm,
  };

  const tabStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  };

  const getTabTextColor = (isActive: boolean) => {
    return isActive ? 'tint' : 'icon';
  };

  return (
    <View style={[containerStyle, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={tabStyle}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <View style={{ marginBottom: theme.spacing.xs }}>
                {tab.icon}
              </View>
            )}
            <Text
              variant="caption"
              color={getTabTextColor(isActive)}
              weight={isActive ? 'medium' : 'normal'}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};