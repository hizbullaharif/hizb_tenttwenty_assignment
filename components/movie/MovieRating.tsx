import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import { Text } from '../ui/Text';

interface MovieRatingProps {
  rating: number;
  voteCount?: number;
  size?: 'small' | 'medium' | 'large';
  showVoteCount?: boolean;
  variant?: 'stars' | 'numeric' | 'both';
}

export const MovieRating: React.FC<MovieRatingProps> = ({
  rating,
  voteCount,
  size = 'medium',
  showVoteCount = false,
  variant = 'both',
}) => {
  const theme = useMovieTheme();

  const getStarRating = (rating: number): string => {
    const normalizedRating = Math.max(0, Math.min(10, rating)); // Clamp between 0-10
    const starCount = Math.round(normalizedRating / 2); // Convert to 5-star scale
    const fullStars = '★'.repeat(starCount);
    const emptyStars = '☆'.repeat(5 - starCount);
    return fullStars + emptyStars;
  };

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const formatVoteCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          ratingText: { ...theme.typography.caption },
          starsText: { ...theme.typography.bodySmall },
          voteText: { ...theme.typography.caption, fontSize: 10 },
        };
      case 'large':
        return {
          ratingText: { ...theme.typography.h4 },
          starsText: { ...theme.typography.h4, fontSize: 22 },
          voteText: { ...theme.typography.bodySmall },
        };
      default: // medium
        return {
          ratingText: { ...theme.typography.body },
          starsText: { ...theme.typography.body, fontSize: 18 },
          voteText: { ...theme.typography.caption },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderStars = () => {
    if (variant === 'numeric') return null;
    
    return (
      <Text 
        style={[styles.stars, sizeStyles.starsText, { color: theme.colors.rating }]}
      >
        {getStarRating(rating)}
      </Text>
    );
  };

  const renderNumericRating = () => {
    if (variant === 'stars') return null;
    
    return (
      <Text 
        variant="movieMeta" 
        weight="semibold"
        style={[sizeStyles.ratingText, { color: theme.colors.rating }]}
      >
        {formatRating(rating)}
      </Text>
    );
  };

  const renderVoteCount = () => {
    if (!showVoteCount || !voteCount) return null;
    
    return (
      <Text 
        variant="caption" 
        color="icon"
        style={[styles.voteCount, sizeStyles.voteText]}
      >
        ({formatVoteCount(voteCount)} votes)
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        {renderStars()}
        {renderNumericRating()}
      </View>
      {renderVoteCount()}
    </View>
  );
};

// Specialized components for common use cases
export const StarRating: React.FC<Omit<MovieRatingProps, 'variant'>> = (props) => (
  <MovieRating {...props} variant="stars" />
);

export const NumericRating: React.FC<Omit<MovieRatingProps, 'variant'>> = (props) => (
  <MovieRating {...props} variant="numeric" />
);

// Rating badge for overlays
export const RatingBadge: React.FC<{
  rating: number;
  style?: any;
}> = ({ rating, style }) => {
  const theme = useMovieTheme();
  
  return (
    <View style={[styles.badge, { backgroundColor: theme.colors.backdrop }, style]}>
      <Text variant="caption" style={styles.badgeText}>
        ⭐ {formatRating(rating)}
      </Text>
    </View>
  );
};

const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    fontFamily: 'Poppins', // Use Poppins for consistent star rendering
  },
  voteCount: {
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});