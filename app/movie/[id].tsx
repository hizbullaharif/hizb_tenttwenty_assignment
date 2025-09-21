import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { MovieDetails } from "../../components/movie/MovieDetails";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useMovieDetails } from "../../hooks/queries/useMovieDetails";
import { useMovieTrailer } from "../../hooks/queries/useMovieVideos";
import { useMovieTheme } from "../../hooks/useMovieTheme";
import { formatErrorMessage } from "../../utils/helpers";

export default function MovieDetailScreen() {
  const theme = useMovieTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = parseInt(id || "0", 10);

  const { data: movie, isLoading, error, refetch } = useMovieDetails(movieId);
  const { data: trailerKey } = useMovieTrailer(movieId);

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <Stack.Screen options={{ title: "Loading..." }} />
        <LoadingSpinner message="Loading movie details..." />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={containerStyle}>
        <Stack.Screen options={{ title: "Error" }} />
        <ErrorMessage
          message={formatErrorMessage(error) || "Failed to load movie details"}
          onRetry={refetch}
        />
      </View>
    );
  }

  const handleWatchTrailer = () => {
    if (trailerKey) {
      router.push(
        `/modals/video-player?videoKey=${trailerKey}&title=${encodeURIComponent(
          movie.title + " - Trailer"
        )}`
      );
    }
  };

  const handleBookTickets = () => {
    router.push(`/movie/seat-selection?movieId=${movieId}`);
  };

  return (
    <View style={containerStyle}>
      <MovieDetails
        movie={movie}
        trailerKey={trailerKey}
        onWatchTrailer={handleWatchTrailer}
        onBookTickets={handleBookTickets}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
