import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
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

// Constants
const GENRE_COLORS = ["#20B2AA", "#FF69B4", "#9370DB", "#DAA520"] as const;
const MAX_GENRES_DISPLAY = 4;
const GRADIENT_COLORS = [
  "transparent",
  "rgba(0, 0, 0, 0.55)",
  "rgba(0, 0, 0, 1)",
] as const;

interface MovieDetailsProps {
  movie: MovieDetail;
  trailerKey?: string | null;
  onWatchTrailer?: () => void;
  onBookTickets?: () => void;
  loading?: boolean;
}

// Custom hooks
const useMovieData = (movie: MovieDetail) => {
  return useMemo(
    () => ({
      backdropUrl: getMovieImageUrl(movie.poster_path, "w780"),
      formattedReleaseDate: formatDate(movie.release_date),
      displayGenres: movie.genres?.slice(0, MAX_GENRES_DISPLAY) || [],
    }),
    [movie.poster_path, movie.release_date, movie.genres]
  );
};

// Utility functions
const getGenreColor = (index: number): string => {
  return GENRE_COLORS[index % GENRE_COLORS.length];
};

// Sub-components
const BackdropImage: React.FC<{ backdropUrl: string | null }> = ({
  backdropUrl,
}) => (
  <>
    {backdropUrl ? (
      <Image
        source={{ uri: backdropUrl }}
        style={styles.backdrop}
        contentFit="cover"
      />
    ) : (
      <View style={[styles.backdrop, styles.fallbackBackdrop]} />
    )}
    <LinearGradient colors={GRADIENT_COLORS} style={styles.gradientOverlay} />
  </>
);

const Header: React.FC = () => {
  const handleBackPress = () => router.back();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Watch</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

const MovieTitleOverlay: React.FC<{
  title: string;
  formattedReleaseDate: string;
  trailerKey?: string | null;
  onWatchTrailer?: () => void;
  onBookTickets?: () => void;
}> = ({
  title,
  formattedReleaseDate,
  trailerKey,
  onWatchTrailer,
  onBookTickets,
}) => (
  <View style={styles.titleOverlay}>
    <Text style={styles.movieTitle}>{title}</Text>
    <Text style={styles.releaseDate}>In Theaters {formattedReleaseDate}</Text>
    <ActionButtons
      trailerKey={trailerKey}
      onWatchTrailer={onWatchTrailer}
      onBookTickets={onBookTickets}
    />
  </View>
);

const ActionButtons: React.FC<{
  trailerKey?: string | null;
  onWatchTrailer?: () => void;
  onBookTickets?: () => void;
}> = ({ trailerKey, onWatchTrailer, onBookTickets }) => (
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
);

const GenreSection: React.FC<{
  genres: Array<{ id: number; name: string }>;
}> = ({ genres }) => {
  if (!genres.length) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Genres</Text>
      <View style={styles.genresContainer}>
        {genres.map((genre, index) => (
          <GenreTag
            key={genre.id}
            name={genre.name}
            color={getGenreColor(index)}
          />
        ))}
      </View>
    </>
  );
};

const GenreTag: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => (
  <View style={[styles.genreTag, { backgroundColor: color }]}>
    <Text style={styles.genreText}>{name}</Text>
  </View>
);

const SectionDivider: React.FC = () => <View style={styles.divider} />;

const OverviewSection: React.FC<{ overview: string }> = ({ overview }) => (
  <>
    <Text style={styles.sectionTitle}>Overview</Text>
    <Text style={styles.overview}>{overview}</Text>
  </>
);

const HeroSection: React.FC<{
  backdropUrl: string | null;
  title: string;
  formattedReleaseDate: string;
  trailerKey?: string | null;
  onWatchTrailer?: () => void;
  onBookTickets?: () => void;
}> = ({
  backdropUrl,
  title,
  formattedReleaseDate,
  trailerKey,
  onWatchTrailer,
  onBookTickets,
}) => (
  <View style={styles.heroSection}>
    <BackdropImage backdropUrl={backdropUrl} />
    <Header />
    <MovieTitleOverlay
      title={title}
      formattedReleaseDate={formattedReleaseDate}
      trailerKey={trailerKey}
      onWatchTrailer={onWatchTrailer}
      onBookTickets={onBookTickets}
    />
  </View>
);

const ContentSection: React.FC<{
  displayGenres: Array<{ id: number; name: string }>;
  overview: string;
}> = ({ displayGenres, overview }) => (
  <ScrollView
    style={styles.contentCard}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.contentCardContent}
  >
    <GenreSection genres={displayGenres} />
    {displayGenres.length > 0 && <SectionDivider />}
    <OverviewSection overview={overview} />
  </ScrollView>
);

// Main component
export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  trailerKey,
  onWatchTrailer,
  onBookTickets,
}) => {
  const { backdropUrl, formattedReleaseDate, displayGenres } =
    useMovieData(movie);

  return (
    <View style={styles.container}>
      <HeroSection
        backdropUrl={backdropUrl}
        title={movie.title}
        formattedReleaseDate={formattedReleaseDate}
        trailerKey={trailerKey}
        onWatchTrailer={onWatchTrailer}
        onBookTickets={onBookTickets}
      />
      <ContentSection displayGenres={displayGenres} overview={movie.overview} />
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
  fallbackBackdrop: {
    backgroundColor: "#444",
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
    lineHeight: 34,
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
  divider: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#000",
    opacity: 0.3,
    marginVertical: 18,
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins",
    color: "#8F8F8F",
  },
});
