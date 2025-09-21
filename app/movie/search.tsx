import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/ui/SearchBar";
import { Text } from "@/components/ui/Text";
import { useMovieSearch } from "@/hooks/queries/useSearch";
import type { SearchResponse } from "@/services/api/types";
import type { Movie } from "@/types/movie";
import { getMovieImageUrl } from "@/utils/helpers";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const GENRES = [
  {
    id: 80,
    name: "Crime",
    color: "#2C2C54",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", // Crime movie poster
  },
  {
    id: 10751,
    name: "Family",
    color: "#4ECDC4",
    image: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", // Family movie poster
  },
  {
    id: 99,
    name: "Documentaries",
    color: "#45B7D1",
    image: "https://image.tmdb.org/t/p/w500/5BwqwxMEjeFtdknRV792Svo0K1v.jpg", // Documentary poster
  },
  {
    id: 18,
    name: "Dramas",
    color: "#96CEB4",
    image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // Drama movie poster
  },
  {
    id: 14,
    name: "Fantasy",
    color: "#FECA57",
    image: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", // Fantasy movie poster
  },
  {
    id: 27,
    name: "Horror",
    color: "#FF9FF3",
    image: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", // Horror movie poster
  },
  {
    id: 878,
    name: "Sci-Fi",
    color: "#5F27CD",
    image: "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg", // Sci-Fi movie poster
  },
  {
    id: 53,
    name: "Thriller",
    color: "#00D2D3",
    image: "https://image.tmdb.org/t/p/w500/6XYLiMxHAaCsoyrVo38LBWMw2p8.jpg", // Thriller movie poster
  },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use the movie search hook only when there's a search query
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useMovieSearch(debouncedQuery, 1, debouncedQuery.length > 2);

  // Type guard to ensure searchResults is properly typed
  const hasSearchResults = (data: any): data is SearchResponse => {
    return (
      data &&
      typeof data === "object" &&
      "results" in data &&
      Array.isArray(data.results)
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderGenreCard = ({ item }: { item: any }) => (
    <View style={styles.genreCard}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.placeholderBackground,
            { backgroundColor: item.color },
          ]}
        />
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.genreTitle}>{item.name}</Text>
      </View>
    </View>
  );

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <View style={styles.searchResultCard}>
      <View style={styles.movieImageContainer}>
        {item.poster_path ? (
          <Image
            source={{ uri: getMovieImageUrl(item.poster_path, "w342") }}
            style={styles.moviePoster}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderPoster}>
            <Text style={styles.placeholderIcon}>🎬</Text>
          </View>
        )}
      </View>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item?.title}
        </Text>
        <Text style={styles.movieGenre}>
          {item?.genre_ids?.length > 0 ? "Movie" : "TV Show"}
        </Text>
      </View>

      <View style={styles.moreOptions}>
        <Text style={styles.moreDots}>⋯</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    // Show empty state for search results
    if (
      searchQuery.length > 2 &&
      hasSearchResults(searchResults) &&
      searchResults.results &&
      searchResults.results.length === 0
    ) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No Movies Found</Text>
          <Text style={styles.emptyText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderContent = () => {
    // Show loading state for search
    if (isLoading && searchQuery.length > 2) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={styles.loadingText}>Searching movies...</Text>
        </View>
      );
    }

    // Show error state for search
    if (isError && searchQuery.length > 2) {
      return (
        <View style={styles.errorContainer}>
          <ErrorMessage message="Failed to search movies. Please try again." />
        </View>
      );
    }

    if (
      searchQuery.length > 2 &&
      hasSearchResults(searchResults) &&
      searchResults.results &&
      searchResults.results.length > 0
    ) {
      return (
        <View style={styles.searchResultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Top Results</Text>
            <View style={styles.resultsDivider} />
          </View>
          <FlatList
            data={searchResults.results}
            renderItem={renderMovieCard}
            contentContainerStyle={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      );
    }

    // Show genres by default (when no search or search query is too short)
    if (searchQuery.length <= 2) {
      return (
        <FlatList
          data={GENRES}
          renderItem={renderGenreCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      );
    }

    // Show empty state for search results
    return renderEmptyState();
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={[styles.searchContainer, { paddingTop: insets.top }]}>
        <SearchBar
          placeholder="TV shows, movies and more"
          value={searchQuery}
          onSearch={handleSearch}
          autoFocus={false}
        />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  genreCard: {
    width: CARD_WIDTH,
    height: 120,
    marginBottom: 16,
    borderRadius: 12,
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
  movieCardContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  searchResultCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 12,
  },
  movieImageContainer: {
    width: 130,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  moviePoster: {
    width: "100%",
    height: "100%",
  },
  placeholderPoster: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "center",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
    paddingRight: 5,
  },
  movieGenre: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  moreOptions: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  moreDots: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
    transform: [{ rotate: "90deg" }],
  },
  searchResultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  resultsDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
  },
  searchResultsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  placeholderBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: "flex-end",
  },
  genreTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
