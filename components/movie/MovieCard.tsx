import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import type { Movie } from "../../types/movie";
import { getMovieImageUrl } from "../../utils/helpers";
import { Text } from "../ui/Text";

interface MovieCardProps {
  movie: Movie;
  onPress?: (movieId: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(movie.id);
    } else {
      router.push(`/movie/${movie.id}`);
    }
  };

  const posterUrl = getMovieImageUrl(movie.poster_path, "w780");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholderBackground}>
          <Text style={styles.placeholderText}>🎬</Text>
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />

      <View style={styles.titleOverlay}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonBackground} />
      <View style={styles.titleOverlay}>
        <View style={[styles.skeletonTitle, styles.skeleton]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  placeholderBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    opacity: 0.5,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Skeleton styles
  skeletonBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
  },
  skeleton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
  },
  skeletonTitle: {
    height: 16,
    width: "70%",
  },
});
