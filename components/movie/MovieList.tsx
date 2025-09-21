import { LegendList } from "@legendapp/list";
import React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import { useMovieTheme } from "../../hooks/useMovieTheme";
import type { Movie } from "../../types/movie";
import { ErrorMessage } from "../ui/ErrorMessage";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Text } from "../ui/Text";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error?: any;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onMoviePress?: (movieId: number) => void;
  refreshing?: boolean;
  hasNextPage?: boolean;
  variant?: "grid" | "list";
  numColumns?: number;
  showFavoriteButton?: boolean;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  error,
  onRefresh,
  onLoadMore,
  onMoviePress,
  refreshing = false,
  hasNextPage = false,
  variant = "grid",
  numColumns = 2,
  showFavoriteButton = true,
}) => {
  const theme = useMovieTheme();

  // Show loading spinner for initial load
  if (loading && movies.length === 0) {
    return <LoadingSpinner message="Loading movies..." />;
  }

  // Show error message if there's an error and no movies
  if (error && movies.length === 0) {
    return (
      <ErrorMessage
        message={error.message || "Failed to load movies"}
        onRetry={onRefresh}
      />
    );
  }

  // Show empty state if no movies and not loading
  if (movies.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="h3" align="center" color="icon">
          🎬
        </Text>
        <Text variant="h4" align="center" style={styles.emptyTitle}>
          {"Empty List"}
        </Text>
        <Text variant="body" align="center" color="icon">
          {
            "We couldn't find any upcoming movies at the moment. Please try again later."
          }
        </Text>
      </View>
    );
  }

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      onPress={onMoviePress}
      showFavoriteButton={showFavoriteButton}
      variant={variant}
    />
  );

  const renderSkeletonCard = ({ index }: { index: number }) => (
    <MovieCardSkeleton key={`skeleton-${index}`} variant={variant} />
  );

  const renderFooter = () => {
    if (!loading || movies.length === 0) return null;

    if (variant === "grid") {
      // Show skeleton cards for grid layout
      const skeletonData = Array.from({ length: 4 }, (_, index) => ({ index }));
      return (
        <View style={styles.footerContainer}>
          {skeletonData.map(renderSkeletonCard)}
        </View>
      );
    }

    // Show loading spinner for list layout
    return (
      <View style={styles.footerSpinner}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !loading && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <LegendList
      data={movies}
      renderItem={renderMovieCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[
        styles.container,
        movies.length === 0 && styles.emptyContainer,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.tint}
            colors={[theme.colors.tint]}
          />
        ) : undefined
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      // Legend List optimizations
      drawDistance={250}
      recycleItems={true}
      estimatedItemSize={variant === "grid" ? 300 : 182}
    />
  );
};

// Grid-specific movie list
export const MovieGrid: React.FC<
  Omit<MovieListProps, "variant" | "numColumns"> & {
    numColumns?: number;
  }
> = ({ numColumns = 2, ...props }) => (
  <MovieList {...props} variant="grid" numColumns={numColumns} />
);

// List-specific movie list
export const MovieListView: React.FC<
  Omit<MovieListProps, "variant" | "numColumns">
> = (props) => <MovieList {...props} variant="list" numColumns={1} />;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  footerSpinner: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
