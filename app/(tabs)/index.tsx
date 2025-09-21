import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MovieGrid } from "@/components/movie/MovieList";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useInfiniteUpcomingMovies } from "@/hooks/queries/useMovies";
import { useMovieTheme } from "@/hooks/useMovieTheme";
import { formatErrorMessage } from "@/utils/helpers";

export default function MoviesScreen() {
  const theme = useMovieTheme();
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteUpcomingMovies();

  const movies = data?.pages.flatMap((page) => page.results || []) || [];

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const toggleViewMode = () => {
    router.push("/More");
  };

  const styles = getStyles(theme);

  const Header = () => (
    <View
      style={[
        styles.headerActions,
        { paddingTop: insets.top, paddingLeft: 16 },
      ]}
    >
      <Text variant="h4" weight="medium" numberOfLines={1}>
        {"Watch"}
      </Text>
      <Button
        title={"🔍"}
        onPress={toggleViewMode}
        variant="ghost"
        size="large"
      />
    </View>
  );

  return (
    <View style={styles.containerStyle}>
      <Header />
      <MovieGrid
        movies={movies}
        loading={isLoading || isFetchingNextPage}
        error={error ? { message: formatErrorMessage(error) } : undefined}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onMoviePress={handleMoviePress}
        refreshing={isRefetching}
        hasNextPage={hasNextPage}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.White,
    },
  });
