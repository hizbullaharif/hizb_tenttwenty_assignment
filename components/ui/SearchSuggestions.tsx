import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import { Text } from './Text';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  visible?: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionPress,
  visible = true,
}) => {
  const theme = useMovieTheme();

  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestionItem,
              {
                backgroundColor: theme.colors.movieCard,
                borderColor: theme.colors.movieCardBorder,
              },
            ]}
            onPress={() => onSuggestionPress(suggestion)}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" numberOfLines={1}>
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Popular search suggestions component
export const PopularSearches: React.FC<{
  onSearchPress: (query: string) => void;
}> = ({ onSearchPress }) => {
  const popularSearches = [
    'Action Movies',
    'Comedy',
    'Marvel',
    'Disney',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Drama',
  ];

  return (
    <SearchSuggestions
      suggestions={popularSearches}
      onSuggestionPress={onSearchPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
});