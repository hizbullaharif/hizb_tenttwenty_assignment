import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import type { MovieDetail } from "../../types/movie";
import { formatDate } from "../../utils/formatters";
import { getMovieImageUrl } from "../../utils/helpers";
import { Button } from "../ui";
import { Text } from "../ui/Text";

const { height } = Dimensions.get("window");
const BACKDROP_HEIGHT = height * 0.6;

interface MovieDetailsProps {
  movie: MovieDetail;
  trailerKey?: string | null;
  onWatchTrailer?: () => void;
  onBookTickets?: () => void;
  loading?: boolean;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  trailerKey,
  onWatchTrailer,
  onBookTickets,
}) => {
  const backdropUrl = getMovieImageUrl(movie.poster_path, "w780");

  const handleBackPress = () => {
    router.back();
  };

  // Genre colors matching the design
  const getGenreColor = (index: number) => {
    const colors = ["#20B2AA", "#FF69B4", "#9370DB", "#DAA520"];
    return colors[index % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: "#2E2739" }]}>
      {/* Hero Section with Backdrop */}
      <View style={styles.heroSection}>
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.backdrop, { backgroundColor: "#444" }]} />
        )}

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.55)", "rgba(0, 0, 0, 1)"]}
          style={styles.gradientOverlay}
        />

        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Watch</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Movie Title Overlay */}
        <View style={styles.titleOverlay}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.releaseDate}>
            In Theaters {formatDate(movie.release_date)}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button title="Get Tickets" onPress={onBookTickets} />

            {trailerKey && (
              <Button
                variant="outline"
                title="▶   Watch Trailer"
                onPress={onWatchTrailer}
              />
            )}
          </View>
        </View>
      </View>

      {/* Scrollable White Content Card */}
      <ScrollView
        style={styles.contentCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentCardContent}
      >
        {/* Genre Tags */}
        {movie.genres && movie.genres.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genresContainer}>
              {movie.genres.slice(0, 4).map((genre, index) => (
                <View
                  key={genre.id}
                  style={[
                    styles.genreTag,
                    { backgroundColor: getGenreColor(index) },
                  ]}
                >
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View
          style={{
            width: "100%",
            height: 0.5,
            backgroundColor: "#000",
            opacity: 0.3,
            marginVertical: 18,
          }}
        />

        {/* Overview Section */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: BACKDROP_HEIGHT,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    lineHeight: 30,
  },
  headerTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 12,
  },
  headerSpacer: {
    width: 40,
  },
  titleOverlay: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  movieTitle: {
    color: "#DAA520",
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 34,
  },
  releaseDate: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 24,
    textAlign: "center",
  },
  actionButtons: {
    width: "100%",
    gap: 12,
  },
  getTicketsButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  getTicketsText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  watchTrailerButton: {
    backgroundColor: "#5A5A5A",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playIcon: {
    color: "white",
    fontSize: 14,
  },
  watchTrailerText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  contentCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flex: 1,
  },
  contentCardContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#202C43",
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  genreText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins",
    color: "#8F8F8F",
  },
});
